package be.pxl.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCommentRequest(
    @NotNull Long postId,
    @NotNull String userName,
    @NotBlank String content
) {}