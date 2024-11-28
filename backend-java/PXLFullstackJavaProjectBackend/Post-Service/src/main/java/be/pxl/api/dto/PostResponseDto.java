package be.pxl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {
    private Long id;
    private String title;
    private Boolean isConcept;
    private String content;
    private String previewContent;
    private String imageUrl;
    private AuthorDto author;
}
