package be.pxl.api.controller;

import be.pxl.PostServiceApp;
import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.domain.Post;
import be.pxl.repository.PostRepository;
import be.pxl.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class PostControllerTest {
    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");
    @Autowired
    private PostService postService;

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url",mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username",mySQLContainer::getUsername);
        registry.add("spring.datasource.password",mySQLContainer::getPassword);
    }
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final String apiUrl = "http://localhost:8081/api/posts";

    @Test
    void createPost_CreatesPost() throws Exception {
        PostRequestDto postRequestDto = PostRequestDto.builder()
                .content("This is a valid post content, which has more than 100 characters to satisfy the content size constraint. It is also long enough to fulfill the minimum requirement for the size of content.")
                .title("Valid Title for Post")
                .isConcept(false)
                .previewContent("This is a preview content, which is at least 50 characters long to meet the size constraint. This is just a placeholder for testing.")
                .imageUrl("https://example.com/image.jpg")
                .category("Technology")
                .inReview(false)
                .authorId(1L)
                .build();


        String postRequestJson = objectMapper.writeValueAsString(postRequestDto);

        mockMvc.perform(MockMvcRequestBuilders.post(apiUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postRequestJson))
                .andExpect(status().isCreated())
                .andReturn();

    }

    @Test
    public void getAllPosts_ReturnsAllPosts() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(apiUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        List<PostResponseDto> postResponseDtos = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>(){});

        assertFalse(postResponseDtos.isEmpty());

    }

    @Test
    public void getPostById_GetsPostById() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(apiUrl + "/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        PostResponseDto postResponseDto = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>(){});

        assertTrue(postResponseDto.getId().equals(1L));
    }

    @Test
    public void getAllinReviewPosts_ReturnsAllPostsInReview() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(apiUrl + "/in-review")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        List<PostResponseDto> postResponseDtos = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>(){});

        assertFalse(postResponseDtos.isEmpty());

    }

    @Test
    void createConcept_CreatesConcept() throws Exception {
        PostRequestDto postRequestDto = PostRequestDto.builder()
                .content("This is a valid post content, which has more than 100 characters to satisfy the content size constraint. It is also long enough to fulfill the minimum requirement for the size of content.")
                .title("Valid Title for Post")
                .isConcept(true)
                .previewContent("This is a preview content, which is at least 50 characters long to meet the size constraint. This is just a placeholder for testing.")
                .imageUrl("https://example.com/image.jpg")
                .category("Technology")
                .inReview(false)
                .authorId(1L)
                .build();


        String postRequestJson = objectMapper.writeValueAsString(postRequestDto);

        mockMvc.perform(MockMvcRequestBuilders.post(apiUrl + "/concepts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postRequestJson))
                .andExpect(status().isCreated())
                .andReturn();

    }

    @Test
    public void getAllConcepts_ReturnsAllConcepts() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get(apiUrl + "/concepts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        List<PostResponseDto> postResponseDtos = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>(){});

        assertFalse(postResponseDtos.isEmpty());

    }

    @Test
    public void deleteConcept_DeletesConcept() throws Exception {
        Post post = postRepository.findById(1L).orElse(null);
        post.setIsConcept(true);
        postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.delete(apiUrl + "/concepts/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent())
                .andReturn();
    }

    @Test
    public void updatePost_UpdatesPost() throws Exception {
        PostRequestDto postRequestDto = PostRequestDto.builder()
                .content("This is a valid post content, which has more than 100 characters to satisfy the content size constraint. It is also long enough to fulfill the minimum requirement for the size of content.")
                .title("Valid Title for Post")
                .isConcept(false)
                .id(2L)
                .previewContent("This is a preview content, which is at least 50 characters long to meet the size constraint. This is just a placeholder for testing.")
                .imageUrl("https://example.com/image.jpg")
                .category("Technology")
                .inReview(true)
                .authorId(1L)
                .build();


        String postRequestJson = objectMapper.writeValueAsString(postRequestDto);

        mockMvc.perform(MockMvcRequestBuilders.put(apiUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postRequestJson))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void approvePost_ApprovesPost() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put(apiUrl + "/approve/2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    void testLogRequestDetailsException() throws Exception {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        when(mockRequest.getMethod()).thenThrow(new RuntimeException("Test Exception"));

        Method logRequestDetailsMethod = PostController.class.getDeclaredMethod("logRequestDetails",
                HttpServletRequest.class, Object.class);
        logRequestDetailsMethod.setAccessible(true);

        PostController controller = new PostController(postService);

        logRequestDetailsMethod.invoke(controller, mockRequest, "test payload");
    }

    @Test
    void testGetClientIpAddress() throws Exception {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn("192.168.1.1, 10.0.0.1");
        when(mockRequest.getHeader("Proxy-Client-IP")).thenReturn(null);
        when(mockRequest.getHeader("WL-Proxy-Client-IP")).thenReturn("unknown");

        Method getClientIpAddressMethod = PostController.class.getDeclaredMethod("getClientIpAddress", HttpServletRequest.class);
        getClientIpAddressMethod.setAccessible(true);

        PostController controller = new PostController(postService);

        String ipAddress = (String) getClientIpAddressMethod.invoke(controller, mockRequest);

        assertEquals("192.168.1.1", ipAddress);
    }
}
