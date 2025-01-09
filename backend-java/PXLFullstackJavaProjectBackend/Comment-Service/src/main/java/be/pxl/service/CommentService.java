package be.pxl.service;

import be.pxl.api.dto.UpdateCommentRequest;
import be.pxl.domain.Comment;
import be.pxl.api.dto.CreateCommentRequest;
import be.pxl.api.dto.CommentResponse;
import be.pxl.exception.CommentNotFoundException;
import be.pxl.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Transactional
    public void addComment(CreateCommentRequest request) {
        logger.info("adding comment for post: {}", request.postId());
        Comment comment = new Comment();
        comment.setPostId(request.postId());
        comment.setUserName(request.userName());
        comment.setContent(request.content());

        commentRepository.save(comment);
        logger.info("comment successfully added");

    }
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        logger.info("getting all comments for post with id: {}", postId);
        List<Comment> comments = commentRepository.findByPostId(postId);

        List<CommentResponse> commentList = comments.stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getPostId(),
                        comment.getUserName(),
                        comment.getContent(),
                        comment.getCreatedAt(),
                        comment.getUpdatedAt()
                ))
                .toList();

        logger.info("comments: {}. successfully get", commentList);
        return commentList;
    }
    @Transactional
    public CommentResponse editComment(Long commentId, String userName, UpdateCommentRequest request) {
        logger.info("editing comment with id: {}", commentId);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment with ID " + commentId + " not found."));

        comment.setContent(request.content());
        Comment updatedComment = commentRepository.save(comment);

        CommentResponse commentResponse = new CommentResponse(
                updatedComment.getId(),
                updatedComment.getPostId(),
                updatedComment.getUserName(),
                updatedComment.getContent(),
                updatedComment.getCreatedAt(),
                updatedComment.getUpdatedAt()
        );
        logger.info("comment successfully updated");
        return commentResponse;
    }

    @Transactional
    public void deleteComment(Long commentId, Long authorId) {
        logger.info("deleting comment with id: {}", commentId);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment with ID " + commentId + " not found."));

        commentRepository.delete(comment);
    }

}