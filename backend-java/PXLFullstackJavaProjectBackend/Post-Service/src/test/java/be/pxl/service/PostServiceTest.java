package be.pxl.service;


import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.domain.Author;
import be.pxl.domain.Post;
import be.pxl.exception.AuthorNotFoundException;
import be.pxl.exception.ConceptNotFoundException;
import be.pxl.exception.InvalidPostException;
import be.pxl.exception.PostNotFoundException;
import be.pxl.repository.AuthorRepository;
import be.pxl.repository.PostRepository;
import be.pxl.utils.PostMapper;
import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;
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
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class PostServiceTest {
    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url",mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username",mySQLContainer::getUsername);
        registry.add("spring.datasource.password",mySQLContainer::getPassword);
    }

    @Mock
    private Validator validator;

    @Mock
    private PostRepository postRepository;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private PostService postService;

    private Author mockAuthor;
    private PostRequestDto mockPostRequestDto;
    private Post mockPost;

    @BeforeEach
    void setUp() {
        mockAuthor = new Author();
        mockAuthor.setId(1L);

        mockPostRequestDto = PostRequestDto.builder()
                .title("Valid Test Post Title")
                .content("This is a valid test post content with more than 100 characters to meet the validation requirements.")
                .previewContent("This is a valid preview content with more than 50 characters.")
                .imageUrl("https://example.com/test-image.jpg")
                .category("Test Category")
                .authorId(1L)
                .build();

        mockPost = PostMapper.toEntity(mockPostRequestDto, mockAuthor);
        mockPost.setId(1L);
        mockPost.setIsConcept(false);
    }

    @Test
    void addPost_ValidPost_ShouldSavePost() {
        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());

        postService.addPost(mockPostRequestDto);

        verify(postRepository).save(any(Post.class));
    }

    @Test
    void addPost_ExistingConceptPost_ShouldUpdateAndPublish() {
        mockPost.setIsConcept(true);
        mockPostRequestDto.setId(1L);

        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        postService.addPost(mockPostRequestDto);

        verify(postRepository).save(mockPost);
        assertFalse(mockPost.getIsConcept());
    }

    @Test
    void addPost_ExistingPublishedPost_ShouldThrowInvalidPostException() {
        mockPostRequestDto.setId(1L);
        mockPost.setIsConcept(false);

        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        assertThrows(InvalidPostException.class, () -> postService.addPost(mockPostRequestDto));
    }

    @Test
    void addPost_InvalidPost_ShouldThrowInvalidPostException() {
        mockPostRequestDto.setId(1L);
        mockPostRequestDto.setContent("too short");

        when(authorRepository.findById(mockPostRequestDto.getAuthorId())).thenReturn(Optional.of(mockAuthor));

        Set<ConstraintViolation<Post>> violations = Set.of(
                mock(ConstraintViolation.class)
        );
        when(validator.validate(any(Post.class))).thenReturn(violations);

        assertThrows(InvalidPostException.class, () -> postService.addPost(mockPostRequestDto));
    }



    @Test
    void addPost_AuthorNotFound_ShouldThrowAuthorNotFoundException() {
        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.empty());

        assertThrows(AuthorNotFoundException.class, () -> postService.addPost(mockPostRequestDto));
    }

    @Test
    void addConcept_NewConcept_ShouldSaveConcept() {
        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());

        postService.addConcept(mockPostRequestDto);

        verify(postRepository).save(any(Post.class));
    }

    @Test
    void addConcept_ExistingConcept_ShouldUpdateConcept() {
        mockPost.setIsConcept(true);
        mockPostRequestDto.setId(1L);

        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        postService.addConcept(mockPostRequestDto);

        verify(postRepository).save(mockPost);
    }

//    @Test
//    void deleteConcept_ExistingPost_ShouldDeletePost() {
//        when(postRepository.existsById(1L)).thenReturn(true);
//
//        postService.deleteConcept(1L);
//
//        verify(postRepository).deleteById(1L);
//    }

    @Test
    void deleteConcept_NonExistingPost_ShouldThrowPostNotFoundException() {
        when(postRepository.existsById(1L)).thenReturn(false);

        assertThrows(PostNotFoundException.class, () -> postService.deleteConcept(1L));
    }

//    @Test
//    void getPosts_ShouldReturnPublishedPosts() {
//        Author author = Author.builder().id(1L).firstName("Dave").lastName("Doe").build();
//        Post publishedPost = Post.builder()
//                .title("Valid Test Post Title")
//                .content("This is a valid test post content with more than 100 characters to meet the validation requirements.")
//                .previewContent("This is a valid preview content with more than 50 characters.")
//                .imageUrl("https://example.com/test-image.jpg")
//                .category("Test Category")
//                .isConcept(false)
//                .author(author)
//                .build();
//        when(postRepository.findAll()).thenReturn(List.of(publishedPost));
//
//        List<PostResponseDto> posts = postService.getPosts();
//
//        assertFalse(posts.isEmpty());
//    }

    @Test
    void getPostById_ExistingPost_ShouldReturnPost() {
        mockPost.setIsConcept(false);
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        PostResponseDto post = postService.getPostById(1L);

        assertNotNull(post);
    }

    @Test
    void getPostById_ConceptPost_ShouldThrowPostNotFoundException() {
        mockPost.setIsConcept(true);
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        assertThrows(PostNotFoundException.class, () -> postService.getPostById(1L));
    }

    @Test
    void getConcepts_ShouldReturnConceptPosts() {
        Author author = Author.builder().id(1L).firstName("Dave").lastName("Doe").build();
        Post conceptPost = Post.builder()
                .title("Valid Test Post Title")
                .content("This is a valid test post content with more than 100 characters to meet the validation requirements.")
                .previewContent("This is a valid preview content with more than 50 characters.")
                .imageUrl("https://example.com/test-image.jpg")
                .category("Test Category")
                .isConcept(true)
                .author(author)
                .build();
        when(postRepository.findAllConcepts()).thenReturn(List.of(conceptPost));

        List<PostResponseDto> concepts = postService.getConcepts();

        assertFalse(concepts.isEmpty());
    }

    @Test
    void getConceptById_ExistingConcept_ShouldReturnConcept() {
        mockPost.setIsConcept(true);
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        PostResponseDto concept = postService.getConceptById(1L);

        assertNotNull(concept);
    }

    @Test
    void getConceptById_PublishedPost_ShouldThrowConceptNotFoundException() {
        mockPost.setIsConcept(false);
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));

        assertThrows(ConceptNotFoundException.class, () -> postService.getConceptById(1L));
    }

    @Test
    void updatePost_ValidPost_ShouldSavePost() {
        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());
        mockPostRequestDto.setId(1L);

        postService.updatePost(mockPostRequestDto);

        verify(postRepository).save(any(Post.class));
    }

    @Test
    void updatePost_PostWithoutId_ShouldNotSave() {
        when(authorRepository.findById(mockAuthor.getId())).thenReturn(Optional.of(mockAuthor));
        when(validator.validate(any())).thenReturn(Collections.emptySet());
        mockPostRequestDto.setId(null);

        postService.updatePost(mockPostRequestDto);

        verify(postRepository, never()).save(any(Post.class));
    }
}