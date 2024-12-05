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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {
    private final Validator validator;
    private final PostRepository postRepository;
    private final AuthorRepository authorRepository;

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Transactional
    public void addPost(PostRequestDto postRequestDto) {
        logger.info("Attempting to add/update post with request: {}", postRequestDto);

        try {
            Author author = findAuthorById(postRequestDto.getAuthorId());
            Post newPost = PostMapper.toEntity(postRequestDto, author);

            validatePost(newPost);
            logger.debug("Post validation successful for post: {}", newPost);

            if (newPost.getId() != null) {
                logger.info("Attempting to update existing post with ID: {}", newPost.getId());

                Post existingPost = postRepository.findById(newPost.getId())
                        .orElseThrow(() -> {
                            logger.error("Post not found with ID: {}", newPost.getId());
                            return new PostNotFoundException("Post not found");
                        });

                // If it's a concept, update the concept
                if (existingPost.getIsConcept()) {
                    logger.info("Updating concept post with ID: {}", existingPost.getId());

                    existingPost.setTitle(newPost.getTitle());
                    existingPost.setContent(newPost.getContent());
                    existingPost.setPreviewContent(newPost.getPreviewContent());
                    existingPost.setImageUrl(newPost.getImageUrl());
                    existingPost.setIsConcept(false);
                    existingPost.setCategory(newPost.getCategory());

                    postRepository.save(existingPost);

                    logger.info("Concept post updated and published successfully. Post ID: {}", existingPost.getId());
                } else {
                    logger.warn("Attempted to modify a published post. Post ID: {}", existingPost.getId());
                    throw new InvalidPostException("Cannot modify a published post");
                }
            }

            postRepository.save(newPost);
            logger.info("New post saved successfully. Post details: {}", newPost);
        } catch (AuthorNotFoundException e) {
            logger.error("Author not found while adding post. Author ID: {}", postRequestDto.getAuthorId(), e);
            throw e;
        } catch (InvalidPostException e) {
            logger.error("Invalid post attempted to be added/updated. Details: {}", postRequestDto, e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error occurred while adding/updating post", e);
            throw e;
        }
    }

    @Transactional
    public void addConcept(PostRequestDto postRequestDto) {
        logger.info("Attempting to add/update concept with request: {}", postRequestDto);

        try {
            Author author = findAuthorById(postRequestDto.getAuthorId());

            Post concept = PostMapper.toEntity(postRequestDto, author);

            validatePost(concept);
            logger.debug("Concept validation successful for post: {}", concept);

            if (concept.getId() != null) {
                logger.info("Attempting to update existing concept with ID: {}", concept.getId());

                Post existingPost = postRepository.findById(concept.getId())
                        .orElseThrow(() -> {
                            logger.error("Concept not found with ID: {}", concept.getId());
                            return new PostNotFoundException("Post not found");
                        });

                if (existingPost.getIsConcept()) {
                    logger.info("Updating existing concept with ID: {}", existingPost.getId());

                    existingPost.setTitle(concept.getTitle());
                    existingPost.setContent(concept.getContent());
                    existingPost.setPreviewContent(concept.getPreviewContent());
                    existingPost.setImageUrl(concept.getImageUrl());
                    existingPost.setCategory(concept.getCategory());

                    postRepository.save(existingPost);

                    logger.info("Concept updated successfully. Concept ID: {}", existingPost.getId());
                } else {
                    logger.warn("Attempted to update a non-concept post. Post ID: {}", existingPost.getId());
                }
            } else {
                // just add new concept
                postRepository.save(concept);
                logger.info("New concept saved successfully. Concept details: {}", concept);
            }
        } catch (AuthorNotFoundException e) {
            logger.error("Author not found while adding concept. Author ID: {}", postRequestDto.getAuthorId(), e);
            throw e;
        } catch (InvalidPostException e) {
            logger.error("Invalid concept attempted to be added/updated. Details: {}", postRequestDto, e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error occurred while adding/updating concept", e);
            throw e;
        }
    }

    @Transactional
    public void deleteConcept(Long id) {
        logger.info("Attempting to delete concept with ID: {}", id);

        try {
            if (postRepository.existsById(id)) {
                Post postToDelete = postRepository.findById(id)
                        .orElseThrow(() -> {
                            logger.error("Unexpected error: Post exists but cannot be retrieved. ID: {}", id);
                            return new PostNotFoundException("Post not found");
                        });

                if (!postToDelete.getIsConcept()) {
                    logger.warn("Attempted to delete a non-concept post. Post ID: {}", id);
                    throw new InvalidPostException("Cannot delete a published post");
                }

                postRepository.deleteById(id);
                logger.info("Concept deleted successfully. Concept ID: {}", id);
            } else {
                logger.warn("Attempted to delete non-existent post. Post ID: {}", id);
                throw new PostNotFoundException("Cannot delete non-existent post with id: %s".formatted(id));
            }
        } catch (PostNotFoundException e) {
            logger.error("Failed to delete concept. Post not found. ID: {}", id, e);
            throw e;
        } catch (InvalidPostException e) {
            logger.error("Attempted to delete a published post. Post ID: {}", id, e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error occurred while deleting concept. ID: {}", id, e);
            throw e;
        }
    }

    public List<PostResponseDto> getPosts() {
        logger.info("Retrieving all published posts");

        try {
            List<PostResponseDto> publishedPosts = postRepository.findAll().stream()
                    .filter(post -> Boolean.FALSE.equals(post.getIsConcept()))
                    .map(PostMapper::toResponse)
                    .collect(Collectors.toList());

            logger.debug("Retrieved {} published posts", publishedPosts.size());
            logger.trace("Published posts details: {}", publishedPosts);

            return publishedPosts;
        } catch (Exception e) {
            logger.error("Error occurred while retrieving published posts", e);
            throw e;
        }
    }

    public PostResponseDto getPostById(Long id) {
        logger.info("Attempting to retrieve published post with ID: {}", id);

        try {
            return postRepository.findById(id)
                    .filter(post -> Boolean.FALSE.equals(post.getIsConcept()))
                    .map(post -> {
                        PostResponseDto postResponse = PostMapper.toResponse(post);
                        logger.debug("Successfully retrieved published post. Post details: {}", postResponse);
                        return postResponse;
                    })
                    .orElseThrow(() -> {
                        logger.warn("Published post not found with ID: {}", id);
                        return new PostNotFoundException("Post with id: %d not found".formatted(id));
                    });
        } catch (PostNotFoundException e) {
            logger.error("Post not found with ID: {}", id);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error occurred while retrieving post by ID: {}", id, e);
            throw e;
        }
    }

    public List<PostResponseDto> getConcepts() {
        logger.info("Retrieving all concepts from the database");

        try {
            List<PostResponseDto> concepts = postRepository.findAllConcepts().stream()
                    .map(PostMapper::toResponse)
                    .collect(Collectors.toList());

            logger.debug("Retrieved {} concepts", concepts.size());
            logger.trace("Concepts details: {}", concepts);

            return concepts;
        } catch (Exception e) {
            logger.error("Error occurred while retrieving concepts", e);
            throw e;
        }
    }

    public PostResponseDto getConceptById(Long id) {
        logger.info("Attempting to retrieve concept with ID: {}", id);

        try {
            return postRepository.findById(id)
                    .filter(Post::getIsConcept)
                    .map(post -> {
                        PostResponseDto conceptResponse = PostMapper.toResponse(post);
                        logger.debug("Successfully retrieved concept. Concept details: {}", conceptResponse);
                        return conceptResponse;
                    })
                    .orElseThrow(() -> {
                        logger.warn("Concept not found with ID: {}", id);
                        return new ConceptNotFoundException("Concept with id: %d not found".formatted(id));
                    });
        } catch (ConceptNotFoundException e) {
            logger.error("Concept not found with ID: {}", id);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error occurred while retrieving concept by ID: {}", id, e);
            throw e;
        }
    }

    public void updatePost(PostRequestDto postRequestDto) {
        Author author = findAuthorById(postRequestDto.getAuthorId());
        Post post = PostMapper.toEntity(postRequestDto, author);

        validatePost(post);

        if (post.getId() != null) {
            postRepository.save(post);
        }
    }


    private Author findAuthorById(long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Author not found with ID: {}", id);
                    return new AuthorNotFoundException("Author with id: %d not found".formatted(id));
                });
        logger.debug("Author found for ID {}: {}", id, author);
        return author;
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