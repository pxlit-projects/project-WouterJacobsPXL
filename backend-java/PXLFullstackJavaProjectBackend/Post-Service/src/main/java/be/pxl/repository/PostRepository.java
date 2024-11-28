package be.pxl.repository;

import be.pxl.api.dto.PostResponseDto;
import be.pxl.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.isConcept = true")
    List<Post> findAllConcepts();
}
