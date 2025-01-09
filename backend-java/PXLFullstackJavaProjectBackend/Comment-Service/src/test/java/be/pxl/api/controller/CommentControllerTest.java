package be.pxl.api.controller;

import be.pxl.api.dto.CommentResponse;
import be.pxl.api.dto.CreateCommentRequest;
import be.pxl.api.dto.UpdateCommentRequest;
import be.pxl.domain.Comment;
import be.pxl.repository.CommentRepository;
import be.pxl.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class CommentControllerTest {
    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");
    @Autowired
    private CommentService commentService;

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommentRepository commentRepository;

    private CreateCommentRequest createRequest;
    private UpdateCommentRequest updateRequest;
    private Comment comment;

    @BeforeEach
    void setUp() {
        createRequest = new CreateCommentRequest(1L, "testUser", "This is a comment.");
        updateRequest = new UpdateCommentRequest("Updated comment content.");
        comment = new Comment();
        comment.setId(1L);
        comment.setPostId(1L);
        comment.setUserName("testUser");
        comment.setContent("This is a comment.");
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void addComment_shouldReturnCreatedStatus() throws Exception {
        Mockito.when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        mockMvc.perform(post("/api/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated());

        Mockito.verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void getCommentsByPostId_shouldReturnListOfComments() throws Exception {
        Mockito.when(commentRepository.findByPostId(1L)).thenReturn(List.of(comment));

        mockMvc.perform(get("/api/comments/posts/{postId}", 1L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].userName").value("testUser"))
                .andExpect(jsonPath("$[0].content").value("This is a comment."));

        Mockito.verify(commentRepository).findByPostId(1L);
    }

    @Test
    void editComment_shouldReturnUpdatedComment() throws Exception {
        comment.setContent(updateRequest.content());

        Mockito.when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        Mockito.when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        mockMvc.perform(put("/api/comments/{commentId}", 1L)
                        .param("userName", "testUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.content").value("Updated comment content."));

        Mockito.verify(commentRepository).findById(1L);
        Mockito.verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void deleteComment_shouldReturnNoContentStatus() throws Exception {
        Mockito.when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        mockMvc.perform(delete("/api/comments/{commentId}", 1L)
                        .param("authorId", "1"))
                .andExpect(status().isNoContent());

        Mockito.verify(commentRepository).findById(1L);
        Mockito.verify(commentRepository).delete(any(Comment.class));
    }

    @Test
    void deleteComment_shouldThrowExceptionWhenCommentNotFound() throws Exception {
        Mockito.when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/comments/{commentId}", 100L)
                        .param("authorId", "1"))
                .andExpect(status().isNotFound());

        Mockito.verify(commentRepository).findById(100L);
    }

    @Test
    void testLogRequestDetailsException() throws Exception {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        when(mockRequest.getMethod()).thenThrow(new RuntimeException("Test Exception"));

        Method logRequestDetailsMethod = CommentController.class.getDeclaredMethod("logRequestDetails",
                HttpServletRequest.class, Object.class);
        logRequestDetailsMethod.setAccessible(true);

        CommentController controller = new CommentController(commentService);

        logRequestDetailsMethod.invoke(controller, mockRequest, "test payload");
    }

    @Test
    void testGetClientIpAddress() throws Exception {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn("192.168.1.1, 10.0.0.1");
        when(mockRequest.getHeader("Proxy-Client-IP")).thenReturn(null);
        when(mockRequest.getHeader("WL-Proxy-Client-IP")).thenReturn("unknown");

        Method getClientIpAddressMethod = CommentController.class.getDeclaredMethod("getClientIpAddress", HttpServletRequest.class);
        getClientIpAddressMethod.setAccessible(true);

        CommentController controller = new CommentController(commentService);

        String ipAddress = (String) getClientIpAddressMethod.invoke(controller, mockRequest);

        assertEquals("192.168.1.1", ipAddress);
    }
}