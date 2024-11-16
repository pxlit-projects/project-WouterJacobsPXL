package be.pxl.service;

import be.pxl.domain.Post;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
@Service
@RequiredArgsConstructor
public class PostService {
    private final Validator validator;

    private void validatePost(Post post) {
        //TODO add logging
        Set<ConstraintViolation<Post>> violations = validator.validate(post);
        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Validation errors:\n");
            for (ConstraintViolation<Post> violation : violations) {
                errorMessage.append("- ").append(violation.getPropertyPath())
                        .append(": ").append(violation.getMessage()).append("\n");
            }
            throw new IllegalArgumentException(errorMessage.toString());
        }
    }
}
