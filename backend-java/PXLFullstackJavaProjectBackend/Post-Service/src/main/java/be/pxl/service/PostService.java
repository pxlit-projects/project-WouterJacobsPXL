package be.pxl.service;

import be.pxl.api.dto.PostRequestDto;
import be.pxl.domain.Author;
import be.pxl.domain.Post;
import be.pxl.exception.AuthorNotFoundException;
import be.pxl.exception.InvalidPostException;
import be.pxl.repository.AuthorRepository;
import be.pxl.repository.PostRepository;
import be.pxl.utils.PostMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
@Service
@RequiredArgsConstructor
public class PostService {
    private final Validator validator;
    private final PostRepository postRepository;
    private final AuthorRepository authorRepository;

    private void addPost(PostRequestDto postRequestDto){
        //TODO add logging
        Author author = findAuthorById(postRequestDto.getAuthorId());
        Post post = PostMapper.toEntity(postRequestDto, author);

        validatePost(post);

        postRepository.save(post);
    }

    private Author findAuthorById(long id){
        return authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException("Author with id: %d not found".formatted(id)) );
    }

    private void validatePost(Post post) {
        //TODO add logging
        Set<ConstraintViolation<Post>> violations = validator.validate(post);
        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Validation errors:\n");
            for (ConstraintViolation<Post> violation : violations) {
                errorMessage.append("- ").append(violation.getPropertyPath())
                        .append(": ").append(violation.getMessage()).append("\n");
            }
            throw new InvalidPostException(errorMessage.toString());
        }
    }
}
