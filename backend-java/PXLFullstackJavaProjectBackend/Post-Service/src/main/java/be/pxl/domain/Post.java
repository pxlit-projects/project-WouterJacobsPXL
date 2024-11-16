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

    @NotNull(message = "Author is required.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;

}
