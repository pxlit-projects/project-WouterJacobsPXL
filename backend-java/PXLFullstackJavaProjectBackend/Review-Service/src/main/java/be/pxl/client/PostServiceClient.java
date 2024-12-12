package be.pxl.client;

import be.pxl.api.dto.PostResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

@FeignClient(name = "post-service")
public interface PostServiceClient {
    @GetMapping("api/posts/in-review")
    List<PostResponseDto> getPostsInReview();

    @PutMapping(value = "api/posts/approve/{id}")
    void approvePost(@PathVariable Long id);

}
