package be.pxl.repository;

import be.pxl.domain.PostReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostReviewRepository extends JpaRepository<PostReview, Long> {
}
