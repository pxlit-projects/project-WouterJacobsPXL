package be.pxl.api.dto;

import be.pxl.domain.ReviewStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInReviewRequestDto {
    //Post field
    private Long postId;
    // ReviewPost fields
    private Long reviewPostId;
    private ReviewStatus reviewStatus;
    private Long reviewerId;
}
