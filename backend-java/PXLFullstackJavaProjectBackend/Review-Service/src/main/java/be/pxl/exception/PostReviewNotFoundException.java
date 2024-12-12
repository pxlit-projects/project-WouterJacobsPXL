package be.pxl.exception;

public class PostReviewNotFoundException extends RuntimeException {
    public PostReviewNotFoundException(String message) {
        super(message);
    }
}
