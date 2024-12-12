package be.pxl.api.controller;

import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    //TODO add 400ths , 500ths error codes

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createPost(
            @Valid @RequestBody PostRequestDto postRequestDto,
            HttpServletRequest request) {
        try {
            logRequestDetails(request, postRequestDto);
            postService.addPost(postRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PostResponseDto>> getAllPosts(HttpServletRequest request) {
        try {
            logRequestDetails(request, "Get All Posts");
            List<PostResponseDto> posts = postService.getPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/in-review",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PostResponseDto>> getAllPostsInReview(HttpServletRequest request) {
        try {
            logRequestDetails(request, "Get All Posts");
            List<PostResponseDto> posts = postService.getPostsInReview();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long id, HttpServletRequest request) {
        try {
            logRequestDetails(request, "Get Post by ID: " + id);
            PostResponseDto post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping(value = "/concepts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PostResponseDto>> getAllConcepts(HttpServletRequest request) {
        try {
            logRequestDetails(request, "Get All Concepts");
            List<PostResponseDto> concepts = postService.getConcepts();
            return ResponseEntity.ok(concepts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/concepts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createConcept(
            @Valid @RequestBody PostRequestDto postRequestDto,
            HttpServletRequest request) {
        try {
            logRequestDetails(request, postRequestDto);
            postService.addConcept(postRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(value = "/concepts/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> deleteConcept(@PathVariable Long id, HttpServletRequest request) {
        try {
            logRequestDetails(request, "Delete Concept ID: " + id);
            postService.deleteConcept(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updatePost(
            @Valid @RequestBody PostRequestDto postRequestDto,
            HttpServletRequest request) {
        try {
            logRequestDetails(request, postRequestDto);
            postService.updatePost(postRequestDto);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/approve/{id}")
    public ResponseEntity<?> approvePost(@PathVariable Long id, HttpServletRequest request){
        try{
            logRequestDetails(request, id);
            postService.approvePost(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private void logRequestDetails(HttpServletRequest request, Object payload) {
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String method = request.getMethod();
            String requestURI = request.getRequestURI();

            logger.info("Incoming Request - Method: {}, URI: {}, IP: {}, User-Agent: {}, Payload: {}",
                    method, requestURI, ipAddress, userAgent, payload);
        } catch (Exception e) {
            logger.error("Error logging request details", e);
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String[] IP_HEADER_CANDIDATES = {
                "X-Forwarded-For",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_X_FORWARDED",
                "HTTP_FORWARDED_FOR",
                "HTTP_FORWARDED",
                "HTTP_CLIENT_IP",
                "HTTP_X_CLUSTER_CLIENT_IP",
                "X-Real-IP"
        };

        for (String header : IP_HEADER_CANDIDATES) {
            String ipAddress = request.getHeader(header);
            if (ipAddress != null && !ipAddress.isEmpty() && !"unknown".equalsIgnoreCase(ipAddress)) {
                return ipAddress.split(",")[0].trim();
            }
        }

        return Optional.ofNullable(request.getRemoteAddr())
                .orElse("Unknown IP");
    }
}
