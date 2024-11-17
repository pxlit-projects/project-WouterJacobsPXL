package be.pxl.service;

import be.pxl.domain.Author;
import be.pxl.domain.Post;
import be.pxl.exception.InvalidAuthorException;
import be.pxl.exception.InvalidPostException;
import be.pxl.repository.AuthorRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final Validator validator;
    private final AuthorRepository authorRepository;

    private void addAuthor(Author author){
        validateAuthor(author);

        authorRepository.save(author);
    }
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
