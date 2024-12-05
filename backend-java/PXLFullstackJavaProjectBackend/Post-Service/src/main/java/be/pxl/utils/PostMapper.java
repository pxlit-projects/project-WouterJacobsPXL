package be.pxl.utils;

import be.pxl.api.dto.AuthorDto;
import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.domain.Author;
import be.pxl.domain.Post;
import be.pxl.exception.InvalidPostException;
import be.pxl.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PostMapper {
    private static final Logger logger = LoggerFactory.getLogger(PostMapper.class);

    public static Post toEntity(PostRequestDto request, Author author) {
        logger.info("Mapping PostRequestDto to Post entity: {}", request.toString());
        try {
            Post post = Post.builder()
                    .id(request.getId())
                    .title(request.getTitle())
                    .isConcept(request.getIsConcept() != null ? request.getIsConcept() : false) // Default to false
                    .content(request.getContent())
                    .previewContent(request.getPreviewContent())
                    .imageUrl(request.getImageUrl())
                    .category(request.getCategory())
                    .author(author)
                    .build();
            logger.info("Mapping PostRequestDto to Post entity successful");
            return post;
        }catch (Exception e){
            throw new InvalidPostException("Invalid input for a post");
        }
    }

    public static PostResponseDto toResponse(Post post) {
        try {
            logger.info("Mapping Post entity to PostRequestDto: {}", post.toString());
            PostResponseDto postResponseDto = PostResponseDto.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .previewContent(post.getPreviewContent())
                    .imageUrl(post.getImageUrl())
                    .category(post.getCategory())
                    .author(toAuthorSummary(post.getAuthor()))
                    .build();
            logger.info("Mapping Post entity to PostRequestDto successful");
            return postResponseDto;
        } catch (Exception e) {
            throw new InvalidPostException("Invalid input for a post");
        }
    }

    private static AuthorDto toAuthorSummary(Author author) {
        return AuthorDto.builder()
                .id(author.getId())
                .firstName(author.getFirstName())
                .lastName(author.getLastName())
                .build();
    }
}
