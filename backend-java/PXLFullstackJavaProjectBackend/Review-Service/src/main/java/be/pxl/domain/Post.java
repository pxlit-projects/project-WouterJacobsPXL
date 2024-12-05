package be.pxl.domain;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    private Long id;
    private String title;
    private Boolean isConcept;
    private String content;
    private String previewContent;
    private String imageUrl;
    private String category;
    private Boolean inReview;
}
