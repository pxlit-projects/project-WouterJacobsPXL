package be.pxl.client;

import be.pxl.api.dto.PostResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "post-service")
public interface PostServiceClient {
    @GetMapping("api/posts")
    List<PostResponseDto> getPosts();

}
