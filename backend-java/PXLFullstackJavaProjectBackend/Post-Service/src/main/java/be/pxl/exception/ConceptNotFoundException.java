package be.pxl.exception;

public class ConceptNotFoundException extends RuntimeException {
    public ConceptNotFoundException(String message) {
        super(message);
    }
}
