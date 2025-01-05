package be.pxl.api;

import be.pxl.api.dto.AuthorDto;
import be.pxl.api.dto.PostInReviewDto;
import be.pxl.api.dto.PostInReviewRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.client.PostServiceClient;
import be.pxl.domain.PostReview;
import be.pxl.domain.ReviewStatus;
import be.pxl.repository.PostReviewRepository;
import be.pxl.service.ReviewService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class ReviewControllerTest {

    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReviewService reviewService;

    @MockBean
    private PostServiceClient postClient;

    @MockBean
    PostReviewRepository postReviewRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private PostInReviewDto mockPostInReviewDto;
    private PostInReviewRequestDto mockPostInReviewRequestDto;
    private PostResponseDto mockPostResponseDto;
    private PostReview mockPostReview;
    private AuthorDto mockAuthorDto;

    @BeforeEach
    void setUp() {
        mockAuthorDto = AuthorDto.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();

        mockPostInReviewDto = PostInReviewDto.builder()
                .postId(1L)
                .title("Sample Title")
                .content("Sample content for the post.")
                .previewContent("Sample preview content.")
                .imageUrl("http://image.url/sample.jpg")
                .category("Sample Category")
                .author(mockAuthorDto)
                .reviewPostId(200L)
                .reviewStatus(ReviewStatus.PENDING)
                .reviewerId(300L)
                .build();

        mockPostInReviewRequestDto = PostInReviewRequestDto.builder()
                .postId(1L)
                .reviewPostId(200L)
                .reviewStatus(ReviewStatus.APPROVED)
                .reviewerId(300L)
                .rejectionReason(null)
                .build();

        mockPostResponseDto = PostResponseDto.builder()
                .id(100L)
                .title("Test Post Title")
                .isConcept(false)
                .content("This is the test content for the post.")
                .previewContent("This is a preview.")
                .imageUrl("http://test-image-url.com/sample.jpg")
                .category("Technology")
                .inReview(true)
                .author(mockAuthorDto)
                .build();

        mockPostReview = PostReview.builder()
                .id(200L)
                .postId(100L)
                .reviewStatus(ReviewStatus.PENDING)
                .reviewerId(300L)
                .rejectionReason("Requires additional content.")
                .build();

        when(postReviewRepository.findById(200L)).thenReturn(Optional.of(mockPostReview));
        when(postReviewRepository.save(mockPostReview)).thenReturn(mockPostReview);
        List<PostResponseDto> postResponseDtos = Collections.singletonList(mockPostResponseDto);

        when(postReviewRepository.findAll())
                .thenReturn(Collections.emptyList())
                .thenReturn(Collections.singletonList(mockPostReview));

        when(postClient.getPostsInReview())
                .thenReturn(postResponseDtos);

        when(postClient.getPostsInReview()).thenReturn(postResponseDtos);
    }

    @Test
    void getAllPostsInReview_ReturnsPostsInReview() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();

        List<PostInReviewDto> postInReviewDtosresponse = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>(){});

        assertFalse(postInReviewDtosresponse.isEmpty());
    }

    @Test
    void updateReviewStatus_UpdatesReviewSuccessfully() throws Exception {
        mockPostReview.setReviewStatus(ReviewStatus.APPROVED);

        // Simulate update and approval
        when(postReviewRepository.findById(200L)).thenReturn(Optional.of(mockPostReview));
        when(postReviewRepository.save(mockPostReview)).thenReturn(mockPostReview);
        doNothing().when(postClient).approvePost(anyLong());

        mockMvc.perform(put("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockPostInReviewRequestDto)))
                .andExpect(status().isOk());

        // Verify repository methods
        verify(postReviewRepository, atMostOnce()).findById(200L);
        verify(postReviewRepository, atMostOnce()).save(mockPostReview);
    }
}
