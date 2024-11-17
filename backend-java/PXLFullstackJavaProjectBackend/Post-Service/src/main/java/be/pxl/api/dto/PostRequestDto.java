package be.pxl.api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
    @NotBlank(message = "Content is required.")
    @Size(min = 100, max = 50000, message = "Content must be between 100 and 50,000 characters.")
    private String content;

    @NotBlank(message = "Title is required.")
    @Size(min = 10, max = 100, message = "Title must be between 10 and 100 characters.")
    private String title;

    @NotBlank(message = "Preview content is required.")
    @Size(min = 50, max = 500, message = "Preview content must be between 50 and 500 characters.")
    private String previewContent;

    @NotBlank(message = "Image URL is required.")
    @URL(protocol = "https", message = "Image URL must be a valid HTTPS URL.")
    @Pattern(regexp = ".*\\.(jpg|jpeg|png|gif|webp)$",
            message = "Image URL must end with a valid image extension (jpg, jpeg, png, gif, or webp)")
    private String imageUrl;

    @NotNull(message = "Author ID is required.")
    @Positive(message = "Author ID must be a positive number.")
    private Long authorId;
}
