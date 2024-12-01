package be.pxl.utils;

import be.pxl.api.dto.AuthorDto;
import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.domain.Author;
import be.pxl.domain.Post;

public class PostMapper {
    public static Post toEntity(PostRequestDto request, Author author) {
        return Post.builder()
                .id(request.getId())
                .title(request.getTitle())
                .isConcept(request.getIsConcept() != null ? request.getIsConcept() : false) // Default to false
                .content(request.getContent())
                .previewContent(request.getPreviewContent())
                .imageUrl(request.getImageUrl())
                .author(author)
                .build();
    }

    public static PostResponseDto toResponse(Post post) {
        return PostResponseDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .previewContent(post.getPreviewContent())
                .imageUrl(post.getImageUrl())
                .author(toAuthorSummary(post.getAuthor()))
                .build();
    }

    private static AuthorDto toAuthorSummary(Author author) {
        return AuthorDto.builder()
                .id(author.getId())
                .firstName(author.getFirstName())
                .lastName(author.getLastName())
                .build();
    }
}
