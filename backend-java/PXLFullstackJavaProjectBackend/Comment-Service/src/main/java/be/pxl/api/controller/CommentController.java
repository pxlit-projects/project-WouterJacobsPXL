package be.pxl.api.controller;

import be.pxl.api.dto.CreateCommentRequest;
import be.pxl.api.dto.CommentResponse;
import be.pxl.api.dto.UpdateCommentRequest;
import be.pxl.exception.CommentNotFoundException;
import be.pxl.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @PostMapping
    public ResponseEntity<?> addComment(@Valid @RequestBody CreateCommentRequest createCommentRequest, HttpServletRequest request) {
        logRequestDetails(request, createCommentRequest);
        commentService.addComment(createCommentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId, HttpServletRequest request) {
        logRequestDetails(request, postId);
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // Edit a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> editComment(
            @PathVariable Long commentId,
            @RequestParam String userName,
            @Valid @RequestBody UpdateCommentRequest updateCommentRequest,
            HttpServletRequest request) {
        logRequestDetails(request, commentId);

        CommentResponse response = commentService.editComment(commentId, userName, updateCommentRequest);
        return ResponseEntity.ok(response);
    }

    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long authorId,
            HttpServletRequest request
    ) {
        try {
            logRequestDetails(request, commentId);
            commentService.deleteComment(commentId, authorId);
            return ResponseEntity.noContent().build();
        }catch (CommentNotFoundException e){
            return ResponseEntity.notFound().build();
        }

    }

    private void logRequestDetails(HttpServletRequest request, Object payload) {
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String method = request.getMethod();
            String requestURI = request.getRequestURI();

            logger.info("Incoming Request - Method: {}, URI: {}, IP: {}, User-Agent: {}, Payload: {}",
                    method, requestURI, ipAddress, userAgent, payload);
        } catch (Exception e) {
            logger.error("Error logging request details", e);
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String[] IP_HEADER_CANDIDATES = {
                "X-Forwarded-For",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_X_FORWARDED",
                "HTTP_FORWARDED_FOR",
                "HTTP_FORWARDED",
                "HTTP_CLIENT_IP",
                "HTTP_X_CLUSTER_CLIENT_IP",
                "X-Real-IP"
        };

        for (String header : IP_HEADER_CANDIDATES) {
            String ipAddress = request.getHeader(header);
            if (ipAddress != null && !ipAddress.isEmpty() && !"unknown".equalsIgnoreCase(ipAddress)) {
                return ipAddress.split(",")[0].trim();
            }
        }

        return Optional.ofNullable(request.getRemoteAddr())
                .orElse("Unknown IP");
    }
}