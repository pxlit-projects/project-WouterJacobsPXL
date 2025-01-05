package be.pxl.service;

import be.pxl.api.dto.AuthorDto;
import be.pxl.api.dto.PostInReviewDto;
import be.pxl.api.dto.PostInReviewRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.client.PostServiceClient;
import be.pxl.domain.PostReview;
import be.pxl.domain.ReviewStatus;
import be.pxl.exception.PostReviewNotFoundException;
import be.pxl.repository.PostReviewRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class ReviewServiceTest {

    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    @Mock
    private PostServiceClient postClient;

    @Mock
    private PostReviewRepository postReviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    private PostReview mockPostReview;
    private PostResponseDto mockPostResponseDto;

    @BeforeEach
    void setUp() {
        mockPostReview = PostReview.builder()
                .id(1L)
                .postId(100L)
                .reviewStatus(ReviewStatus.PENDING)
                .build();

        mockPostResponseDto = PostResponseDto.builder()
                .id(100L)
                .title("Sample Title")
                .content("Sample Content")
                .previewContent("Sample Preview")
                .imageUrl("http://image.url")
                .category("Sample Category")
                .author(AuthorDto.builder()
                        .id(1L)
                        .firstName("Test")
                        .lastName("author")
                        .build())
                .inReview(Boolean.TRUE)
                .build();
    }

    @Test
    void getAllPostsInReview_GetsAllTestsInReview() {
        List<PostResponseDto> postResponseDtos = Collections.singletonList(mockPostResponseDto);

        when(postReviewRepository.findAll())
                .thenReturn(Collections.emptyList())
                .thenReturn(Collections.singletonList(mockPostReview));

        when(postClient.getPostsInReview())
                .thenReturn(postResponseDtos);

        List<PostInReviewDto> result = reviewService.getAllPostsInReview();

        assertThat(result).hasSize(1);

        PostInReviewDto resultDto = result.get(0);
        assertThat(resultDto.getPostId()).isEqualTo(100L);
        assertThat(resultDto.getTitle()).isEqualTo("Sample Title");

        verify(postReviewRepository, times(2)).findAll();
        verify(postClient, times(2)).getPostsInReview();
        verify(postReviewRepository).saveAll(anyList());
    }

    @Test
    void updateStatusOfReview_WithNullStatus_ThrowsException() {
        PostInReviewRequestDto requestDto = PostInReviewRequestDto.builder()
                .reviewPostId(1L)
                .reviewStatus(null)
                .build();

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.updateStatusOfReview(requestDto)
        );

        assertThat(exception.getMessage()).isEqualTo("ReviewStatus cannot be null");
        verifyNoInteractions(postReviewRepository);
    }

    @Test
    void updateStatusOfReview_WithNonExistentReview_ThrowsException() {
        PostInReviewRequestDto requestDto = PostInReviewRequestDto.builder()
                .reviewPostId(999L)
                .reviewStatus(ReviewStatus.APPROVED)
                .build();

        when(postReviewRepository.findById(999L)).thenReturn(Optional.empty());

        PostReviewNotFoundException exception = assertThrows(
                PostReviewNotFoundException.class,
                () -> reviewService.updateStatusOfReview(requestDto)
        );

        assertThat(exception.getMessage()).isEqualTo("post review with id: 999 not found");
        verify(postReviewRepository).findById(999L);
        verifyNoMoreInteractions(postReviewRepository);
    }

    @Test
    void updateStatusOfReview_WithSameStatus_DoesNotUpdateReview() {
        PostReview existingReview = PostReview.builder()
                .id(1L)
                .postId(100L)
                .reviewStatus(ReviewStatus.APPROVED)
                .build();

        PostInReviewRequestDto requestDto = PostInReviewRequestDto.builder()
                .reviewPostId(1L)
                .reviewStatus(ReviewStatus.APPROVED)
                .build();

        when(postReviewRepository.findById(1L)).thenReturn(Optional.of(existingReview));

        reviewService.updateStatusOfReview(requestDto);

        verify(postReviewRepository).findById(1L);
        verify(postClient).approvePost(100L);  // Should still call approvePost for APPROVED status
        verifyNoMoreInteractions(postReviewRepository);  // Verify save was not called
    }

    @Test
    void updateStatusOfReview_WithRejectionReason_UpdatesReviewAndSendsMessage() {
        PostReview existingReview = PostReview.builder()
                .id(1L)
                .postId(100L)
                .reviewStatus(ReviewStatus.PENDING)
                .build();

        PostInReviewRequestDto requestDto = PostInReviewRequestDto.builder()
                .reviewPostId(1L)
                .reviewStatus(ReviewStatus.REJECTED)
                .rejectionReason("Content inappropriate")
                .build();

        when(postReviewRepository.findById(1L)).thenReturn(Optional.of(existingReview));
        when(postReviewRepository.save(any(PostReview.class))).thenReturn(existingReview);

        reviewService.updateStatusOfReview(requestDto);

        verify(postReviewRepository).findById(1L);
        verify(postReviewRepository).save(argThat(review ->
                review.getReviewStatus() == ReviewStatus.REJECTED &&
                        "Content inappropriate".equals(review.getRejectionReason())
        ));
        verifyNoInteractions(postClient);  // Should not call approvePost for REJECTED status
    }

    @Test
    void updateStatusOfReview_WithApprovedStatus_UpdatesReviewAndApprovesPost() {
        PostReview existingReview = PostReview.builder()
                .id(1L)
                .postId(100L)
                .reviewStatus(ReviewStatus.PENDING)
                .build();

        PostInReviewRequestDto requestDto = PostInReviewRequestDto.builder()
                .reviewPostId(1L)
                .reviewStatus(ReviewStatus.APPROVED)
                .build();

        when(postReviewRepository.findById(1L)).thenReturn(Optional.of(existingReview));
        when(postReviewRepository.save(any(PostReview.class))).thenReturn(existingReview);

        reviewService.updateStatusOfReview(requestDto);

        verify(postReviewRepository).findById(1L);
        verify(postReviewRepository).save(argThat(review ->
                review.getReviewStatus() == ReviewStatus.APPROVED
        ));
        verify(postClient).approvePost(100L);
    }

    @Test
    void updateStatusOfReview_WithPendingStatus_DoesNotUpdateReview() {
        PostReview existingReview = PostReview.builder()
                .id(1L)
                .postId(100L)
                .reviewStatus(ReviewStatus.APPROVED)
                .build();

        PostInReviewRequestDto requestDto = PostInReviewRequestDto.builder()
                .reviewPostId(1L)
                .reviewStatus(ReviewStatus.PENDING)
                .build();

        when(postReviewRepository.findById(1L)).thenReturn(Optional.of(existingReview));

        reviewService.updateStatusOfReview(requestDto);

        verify(postReviewRepository).findById(1L);
        verifyNoMoreInteractions(postReviewRepository);  // Should not save for PENDING status
        verify(postClient).approvePost(100L);  // Should still call approvePost because status is APPROVED
    }
}
