package be.pxl.api.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateCommentRequest(
    @NotBlank String content
) {}