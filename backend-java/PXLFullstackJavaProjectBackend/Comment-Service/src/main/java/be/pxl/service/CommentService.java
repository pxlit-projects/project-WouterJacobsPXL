package be.pxl.service;

import be.pxl.api.dto.UpdateCommentRequest;
import be.pxl.domain.Comment;
import be.pxl.api.dto.CreateCommentRequest;
import be.pxl.api.dto.CommentResponse;
import be.pxl.exception.CommentNotFoundException;
import be.pxl.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    //TODO add a check method for checking if the post even exists etc.
    @Transactional
    public void addComment(CreateCommentRequest request) {
        Comment comment = new Comment();
        comment.setPostId(request.postId());
        comment.setUserName(request.userName());
        comment.setContent(request.content());

        commentRepository.save(comment);
    }
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getPostId(),
                        comment.getUserName(),
                        comment.getContent(),
                        comment.getCreatedAt(),
                        comment.getUpdatedAt()
                ))
                .toList();
    }
    @Transactional
    public CommentResponse editComment(Long commentId, String userName, UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment with ID " + commentId + " not found."));

        comment.setContent(request.content());
        Comment updatedComment = commentRepository.save(comment);

        return new CommentResponse(
                updatedComment.getId(),
                updatedComment.getPostId(),
                updatedComment.getUserName(),
                updatedComment.getContent(),
                updatedComment.getCreatedAt(),
                updatedComment.getUpdatedAt()
        );
    }

    @Transactional
    public void deleteComment(Long commentId, Long authorId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment with ID " + commentId + " not found."));

        commentRepository.delete(comment);
    }

}