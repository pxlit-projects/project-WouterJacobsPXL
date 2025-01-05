package be.pxl.service;

import be.pxl.api.dto.PostInReviewDto;
import be.pxl.api.dto.PostInReviewRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.client.PostServiceClient;
import be.pxl.domain.PostReview;
import be.pxl.domain.ReviewStatus;
import be.pxl.exception.PostReviewNotFoundException;
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
    private final MessageService messageService;
    private final PostReviewRepository postReviewRepository;

    public List<PostInReviewDto> getAllPostsInReview() {
        logger.debug("Starting to retrieve all posts in review");

        try {
            updateDatabase();

            List<PostReview> postReviews = postReviewRepository.findAll();
            logger.info("Retrieved {} total post reviews from database", postReviews.size());

            List<PostResponseDto> externalPosts = postClient.getPostsInReview();
            logger.info("Retrieved {} posts from external service", externalPosts.size());

            Map<Long, PostResponseDto> postDtoMap = externalPosts.stream()
                    .collect(Collectors.toMap(PostResponseDto::getId, post -> post));

            List<PostInReviewDto> postsInReview = postReviews.stream()
                    .filter(postReview -> !postReview.getReviewStatus().equals(ReviewStatus.APPROVED))
                    .map(postReview -> {
                        PostResponseDto postDto = postDtoMap.get(postReview.getPostId());

                        PostInReviewDto reviewDto = PostInReviewDto.builder()
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

                        logger.debug("Mapped post review: postId={}, reviewStatus={}",
                                postReview.getPostId(), postReview.getReviewStatus());

                        return reviewDto;
                    })
                    .collect(Collectors.toList());

            logger.info("Returning {} posts in review", postsInReview.size());
            return postsInReview;
        } catch (Exception e) {
            logger.error("Error retrieving posts in review", e);
            throw e;
        }
    }

    public void updateStatusOfReview(PostInReviewRequestDto reviewRequestDto) {
        logger.debug("Attempting to update review status: reviewPostId={}", reviewRequestDto.getReviewPostId());

        if (reviewRequestDto.getReviewStatus() == null) {
            logger.error("Attempted to update review with null review status");
            throw new IllegalArgumentException("ReviewStatus cannot be null");
        }

        PostReview postReview = postReviewRepository.findById(reviewRequestDto.getReviewPostId())
                .orElseThrow(() -> {
                    logger.error("Post review not found: id={}", reviewRequestDto.getReviewPostId());
                    return new PostReviewNotFoundException(
                            "post review with id: %s not found".formatted(reviewRequestDto.getReviewPostId())
                    );
                });

        if (reviewRequestDto.getReviewStatus() != ReviewStatus.PENDING &&
                !reviewRequestDto.getReviewStatus().equals(postReview.getReviewStatus())) {

            logger.info("Updating review status: postId={}, oldStatus={}, newStatus={}",
                    postReview.getPostId(), postReview.getReviewStatus(), reviewRequestDto.getReviewStatus());

            postReview.setReviewStatus(reviewRequestDto.getReviewStatus());

            if (reviewRequestDto.getRejectionReason() != null) {
                logger.debug("Adding rejection reason to post review");
                postReview.setRejectionReason(reviewRequestDto.getRejectionReason());
                if (messageService != null) messageService.sendRejectionMessage(reviewRequestDto.getRejectionReason());
            }

            postReviewRepository.save(postReview);
        }

        if (postReview.getReviewStatus().equals(ReviewStatus.APPROVED)) {
            logger.info("Approving post: postId={}", postReview.getPostId());
            postClient.approvePost(postReview.getPostId());
        }
    }

    private void updateDatabase() {
        logger.debug("Starting database update process for reviews");

        try {
            List<PostResponseDto> posts = postClient.getPostsInReview();
            logger.info("Retrieved {} posts from external service", posts.size());

            List<PostReview> allPostsInReview = postReviewRepository.findAll();
            logger.debug("Current number of posts in review database: {}", allPostsInReview.size());

            Set<Long> existingPostIds = allPostsInReview.stream()
                    .map(PostReview::getPostId)
                    .collect(Collectors.toSet());

            List<PostReview> newPostsInReview = posts.stream()
                    .filter(PostResponseDto::getInReview)
                    .filter(post -> !existingPostIds.contains(post.getId()))
                    .map(post -> {
                        PostReview newReview = PostReview.builder()
                                .postId(post.getId())
                                .reviewStatus(ReviewStatus.PENDING)
                                .reviewerId(null)
                                .build();

                        logger.debug("Creating new post review: postId={}", post.getId());
                        return newReview;
                    })
                    .collect(Collectors.toList());

            if (!newPostsInReview.isEmpty()) {
                logger.info("Saving {} new posts to review database", newPostsInReview.size());
                postReviewRepository.saveAll(newPostsInReview);
            } else {
                logger.debug("No new posts to add to review database");
            }
        } catch (Exception e) {
            logger.error("Error updating review database", e);
            throw e;
        }
    }
}