package be.pxl.api.controller;

import be.pxl.api.dto.PostInReviewDto;
import be.pxl.api.dto.PostInReviewRequestDto;
import be.pxl.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PostInReviewDto>> getAllPostsInReview(HttpServletRequest request) {
        logRequestDetails(request,"Get All Reviews" );
            List<PostInReviewDto> posts = reviewService.getAllPostsInReview();
            return ResponseEntity.ok(posts);
    }

    @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateReviewStatus(@RequestBody PostInReviewRequestDto postInReviewRequestDto, HttpServletRequest request) {
        logRequestDetails(request, postInReviewRequestDto);
        reviewService.updateStatusOfReview(postInReviewRequestDto);
        return ResponseEntity.ok().build();
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
