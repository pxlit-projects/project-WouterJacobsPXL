package be.pxl.service;

import be.pxl.api.dto.CommentResponse;
import be.pxl.api.dto.CreateCommentRequest;
import be.pxl.api.dto.UpdateCommentRequest;
import be.pxl.domain.Comment;
import be.pxl.exception.CommentNotFoundException;
import be.pxl.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class CommentServiceTest {
    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    private Comment testComment;
    private static final Long COMMENT_ID = 1L;
    private static final Long POST_ID = 1L;
    private static final String USER_NAME = "testUser";
    private static final String CONTENT = "Test content";

    @BeforeEach
    void setUp() {
        testComment = new Comment();
        testComment.setId(COMMENT_ID);
        testComment.setPostId(POST_ID);
        testComment.setUserName(USER_NAME);
        testComment.setContent(CONTENT);
    }

    @Test
    void addComment_ShouldSaveNewComment() {
        // Arrange
        CreateCommentRequest request = new CreateCommentRequest(POST_ID, USER_NAME, CONTENT);

        // Act
        commentService.addComment(request);

        // Assert
        verify(commentRepository, atMostOnce()).save(any(Comment.class));
    }

    @Test
    @Transactional
    void getCommentsByPostId_ShouldReturnListOfComments() {
        // Arrange
        Comment comment1 = new Comment();
        comment1.setPostId(POST_ID);
        comment1.setUserName(USER_NAME);
        comment1.setContent(CONTENT);

        Comment comment2 = new Comment();
        comment2.setPostId(POST_ID);
        comment2.setUserName(USER_NAME);
        comment2.setContent(CONTENT);

        List<Comment> mockComments = new ArrayList<>();
        mockComments.add(comment1);
        mockComments.add(comment2);

        // Mock the repository behavior
        when(commentRepository.findByPostId(POST_ID)).thenReturn(mockComments);

        // Act
        List<CommentResponse> result = commentService.getCommentsByPostId(POST_ID);

        // Assert
        assertEquals(2, result.size());
        verify(commentRepository, atMostOnce()).findByPostId(POST_ID);
    }

    @Test
    void getCommentsByPostId_ShouldReturnEmptyList_WhenNoCommentsFound() {
        // Act
        List<CommentResponse> result = commentService.getCommentsByPostId(POST_ID);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void editComment_ShouldUpdateAndReturnComment_WhenCommentExists() {
        // Arrange
        String updatedContent = "Updated content";
        UpdateCommentRequest request = new UpdateCommentRequest(updatedContent);

        Comment existingComment = new Comment();
        existingComment.setId(COMMENT_ID);
        existingComment.setPostId(POST_ID);
        existingComment.setUserName(USER_NAME);
        existingComment.setContent(CONTENT);

        when(commentRepository.findById(COMMENT_ID)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment comment = invocation.getArgument(0);
            comment.setContent(updatedContent);
            return comment;
        });

        // Act
        CommentResponse result = commentService.editComment(COMMENT_ID, USER_NAME, request);

        // Assert
        assertEquals(updatedContent, result.content());
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void editComment_ShouldThrowException_WhenCommentNotFound() {
        // Arrange
        UpdateCommentRequest request = new UpdateCommentRequest("Updated content");
        when(commentRepository.findById(COMMENT_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () ->
                commentService.editComment(COMMENT_ID, USER_NAME, request)
        );
    }

    @Test
    void deleteComment_ShouldDeleteComment_WhenCommentExists() {
        // Arrange
        when(commentRepository.findById(COMMENT_ID)).thenReturn(Optional.of(testComment));

        // Act
        commentService.deleteComment(COMMENT_ID, 1L);

        // Assert
        verify(commentRepository).delete(testComment);
    }

    @Test
    void deleteComment_ShouldThrowException_WhenCommentNotFound() {
        // Arrange
        when(commentRepository.findById(COMMENT_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () ->
                commentService.deleteComment(COMMENT_ID, 1L)
        );
    }
}