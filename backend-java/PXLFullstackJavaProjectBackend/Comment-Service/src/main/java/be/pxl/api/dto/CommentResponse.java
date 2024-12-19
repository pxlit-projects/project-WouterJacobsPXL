package be.pxl.api.dto;

import java.time.LocalDateTime;

public record CommentResponse(
    Long id,
    Long postId,
    String userName,
    String content,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}