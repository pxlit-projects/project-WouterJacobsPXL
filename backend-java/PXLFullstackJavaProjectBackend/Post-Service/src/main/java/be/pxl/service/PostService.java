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
import jakarta.transaction.Transactional;
import jakarta.validation.Validator;
import jakarta.ws.rs.POST;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final Validator validator;
    private final PostRepository postRepository;
    private final AuthorRepository authorRepository;

    @Transactional
    public void addPost(PostRequestDto postRequestDto) {
        Author author = findAuthorById(postRequestDto.getAuthorId());
        Post newPost = PostMapper.toEntity(postRequestDto, author);

        validatePost(newPost);

        // If the post had concept, publish it
        if (newPost.getId() != null) {
            Post existingPost = postRepository.findById(newPost.getId())
                    .orElseThrow(() -> new PostNotFoundException("Post not found"));

            // If it's a concept, update the concept
            if (existingPost.getIsConcept()) {
                existingPost.setTitle(newPost.getTitle());
                existingPost.setContent(newPost.getContent());
                existingPost.setPreviewContent(newPost.getPreviewContent());
                existingPost.setImageUrl(newPost.getImageUrl());
                existingPost.setIsConcept(false);
                existingPost.setCategory(newPost.getCategory());
                postRepository.save(existingPost);
            }else{
                throw new InvalidPostException("Cannot modify a published post");
            }
        }
        // just add the post
        postRepository.save(newPost);
    }

    @Transactional
    public void addConcept(PostRequestDto postRequestDto) {
        Author author = findAuthorById(postRequestDto.getAuthorId());
        Post concept = PostMapper.toEntity(postRequestDto, author);

        validatePost(concept);

        if (concept.getId() != null) {
            Post existingPost = postRepository.findById(concept.getId())
                    .orElseThrow(() -> new PostNotFoundException("Post not found"));

            // If it's a concept, update the concept
            if (existingPost.getIsConcept()) {
                existingPost.setTitle(concept.getTitle());
                existingPost.setContent(concept.getContent());
                existingPost.setPreviewContent(concept.getPreviewContent());
                existingPost.setImageUrl(concept.getImageUrl());
                existingPost.setCategory(concept.getCategory());
                postRepository.save(existingPost);
            }
        }else{
            postRepository.save(concept);
        }
    }

    @Transactional
    public void deleteConcept(Long id) {
        if (postRepository.existsById(id)){
            postRepository.deleteById(id);
        }else{
            throw new PostNotFoundException("Cannot delete non-existent post with id: %s".formatted(id));
        }
    }

    public List<PostResponseDto> getPosts() {
        return postRepository.findAll().stream()
                .filter(post -> Boolean.FALSE.equals(post.getIsConcept()))
                .map(PostMapper::toResponse)
                .collect(Collectors.toList());
    }

    public PostResponseDto getPostById(Long id) {
        return postRepository.findById(id)
                .filter(post -> Boolean.FALSE.equals(post.getIsConcept()))
                .map(PostMapper::toResponse)
                .orElseThrow(() -> new PostNotFoundException("Post with id: %d not found".formatted(id)));
    }

    public List<PostResponseDto> getConcepts() {
        return postRepository.findAllConcepts().stream().map(PostMapper::toResponse).toList();
    }

    public PostResponseDto getConceptById(Long id) {
        return postRepository.findById(id)
                .filter(Post::getIsConcept)
                .map(PostMapper::toResponse)
                .orElseThrow(() -> new ConceptNotFoundException("Concept with id: %d not found".formatted(id)));
    }

    public void updatePost(PostRequestDto postRequestDto){
        Author author = findAuthorById(postRequestDto.getAuthorId());
        Post post = PostMapper.toEntity(postRequestDto, author);

        validatePost(post);

        if (post.getId() != null){
            postRepository.save(post);
        }
    }


    private Author findAuthorById(long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException("Author with id: %d not found".formatted(id)));
    }

    private void validatePost(Post post) {
        var violations = validator.validate(post);
        if (!violations.isEmpty()) {
            var errorMessage = violations.stream()
                    .map(v -> "- " + v.getPropertyPath() + ": " + v.getMessage())
                    .collect(Collectors.joining("\n", "Validation errors:\n", ""));
            throw new InvalidPostException(errorMessage);
        }
    }
}