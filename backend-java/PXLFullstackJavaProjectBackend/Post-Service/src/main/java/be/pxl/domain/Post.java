package be.pxl.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Title is required.")
    @Size(min = 10, max = 100, message = "Title must be between 10 and 100 characters.")
    private String title;

    @Column(name = "is_concept", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isConcept;

    @Lob
    @NotBlank(message = "Content is required.")
    @Size(min = 100, max = 50000, message = "Content must be between 100 and 50,000 characters.")
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @NotBlank(message = "Preview content is required.")
    @Size(min = 50, max = 500, message = "Preview content must be between 50 and 500 characters.")
    @Column(columnDefinition = "MEDIUMTEXT" , name = "preview_content")
    private String previewContent;

    @NotBlank(message = "Image URL is required.")
    @URL(protocol = "https", message = "Image URL must be a valid HTTPS URL.")
    @Pattern(regexp = ".*\\.(jpg|jpeg|png|gif|webp)$",
            message = "Image URL must end with a valid image extension (jpg, jpeg, png, gif, or webp)")
    private String imageUrl;

    @NotBlank(message = "Category is required.")
    private String category;

    @Column(name = "in_review", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean inReview;

    @NotNull(message = "Author is required.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;
}
