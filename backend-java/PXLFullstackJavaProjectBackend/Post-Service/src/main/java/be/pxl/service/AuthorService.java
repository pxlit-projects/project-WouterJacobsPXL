package be.pxl.service;

import be.pxl.domain.Author;
import be.pxl.domain.Post;
import be.pxl.exception.InvalidAuthorException;
import be.pxl.exception.InvalidPostException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final Validator validator;

    private void validateAuthor(Author author) {
        //TODO add logging
        Set<ConstraintViolation<Author>> violations = validator.validate(author);
        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Validation errors:\n");
            for (ConstraintViolation<Author> violation : violations) {
                errorMessage.append("- ").append(violation.getPropertyPath())
                        .append(": ").append(violation.getMessage()).append("\n");
            }
            throw new InvalidAuthorException(errorMessage.toString());
        }
    }
}
