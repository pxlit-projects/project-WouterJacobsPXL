package be.pxl.api.dto;

import be.pxl.domain.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInReviewDto {
    // Post fields
    private Long postId;
    private String title;
    private String content;
    private String previewContent;
    private String imageUrl;
    private String category;
    private AuthorDto author;

    // ReviewPost fields
    private Long reviewPostId;
    private ReviewStatus reviewStatus;
    private Long reviewerId;
}
