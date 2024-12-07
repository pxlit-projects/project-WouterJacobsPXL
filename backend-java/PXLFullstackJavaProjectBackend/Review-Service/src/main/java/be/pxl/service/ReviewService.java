package be.pxl.service;

import be.pxl.api.dto.PostInReviewDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.client.PostServiceClient;
import be.pxl.domain.Post;
import be.pxl.domain.PostReview;
import be.pxl.domain.ReviewStatus;
import be.pxl.repository.PostReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
    private final PostServiceClient postClient;

    private final PostReviewRepository postReviewRepository;

    public List<PostInReviewDto> getAllPostsInReview() {
        updateDatabase();
        logger.info("getting all posts in review");
        List<PostReview> postReviews = postReviewRepository.findAll();

        List<PostResponseDto> externalPosts = postClient.getPosts();

        Map<Long, PostResponseDto> postDtoMap = externalPosts.stream()
                .collect(Collectors.toMap(PostResponseDto::getId, post -> post));

        return postReviews.stream()
                .map(postReview -> {
                    PostResponseDto postDto = postDtoMap.get(postReview.getPostId()); // Find matching PostResponseDto
                    return PostInReviewDto.builder()
                            .postId(postReview.getPostId())
                            .title(postDto != null ? postDto.getTitle() : null)
                            .content(postDto != null ? postDto.getContent() : null)
                            .previewContent(postDto != null ? postDto.getPreviewContent() : null)
                            .imageUrl(postDto != null ? postDto.getImageUrl() : null)
                            .category(postDto != null ? postDto.getCategory() : null)
                            .author(postDto != null ? postDto.getAuthor() : null)
                            .reviewPostId(postReview.getId())
                            .reviewStatus(postReview.getReviewStatus())
                            .reviewerId(postReview.getReviewerId())
                            .build();
                })
                .collect(Collectors.toList());
    }


    private void updateDatabase(){
        logger.info("Updating Review database...");
        List<PostResponseDto> posts = postClient.getPosts();
        List<PostReview> allPostsInReview = postReviewRepository.findAll();

        Set<Long> existingPostIds = allPostsInReview.stream()
                .map(PostReview::getPostId)
                .collect(Collectors.toSet());

        List<PostReview> newPostsInReview = posts.stream()
                .filter(PostResponseDto::getInReview)
                .filter(post -> !existingPostIds.contains(post.getId())) // Exclude posts already in the DB
                .map(post -> PostReview.builder()
                        .postId(post.getId())
                        .reviewStatus(ReviewStatus.PENDING) // Default status for new reviews
                        .reviewerId(null)
                        .build())
                .collect(Collectors.toList());

        if (!newPostsInReview.isEmpty()) {
            postReviewRepository.saveAll(newPostsInReview);
        }
    }
}
