package be.pxl.api.controller;

import be.pxl.api.dto.CreateCommentRequest;
import be.pxl.api.dto.CommentResponse;
import be.pxl.api.dto.UpdateCommentRequest;
import be.pxl.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> addComment(@Valid @RequestBody CreateCommentRequest request) {
        commentService.addComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // Edit a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> editComment(
            @PathVariable Long commentId,
            @RequestParam String userName, // Validate that this matches the logged-in user
            @Valid @RequestBody UpdateCommentRequest request
    ) {
        CommentResponse response = commentService.editComment(commentId, userName, request);
        return ResponseEntity.ok(response);
    }

    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long authorId // Validate that this matches the logged-in user
    ) {
        commentService.deleteComment(commentId, authorId);
        return ResponseEntity.noContent().build();
    }
}