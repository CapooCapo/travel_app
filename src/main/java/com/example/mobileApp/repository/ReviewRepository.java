package com.example.mobileApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mobileApp.entity.Review;
import com.example.mobileApp.dto.response.ReviewResponse;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByLocationId(Long locationId, Pageable pageable);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    List<Review> findAllByUserId(Long userId);

    boolean existsByUserIdAndLocationId(Long userId, Long locationId);

    Optional<Review> findByUserIdAndLocationId(Long userId, Long locationId);

    Integer countByLocationId(Long locationId);

    void deleteByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.location.id = :locationId")
    Double getAverageRating(Long locationId);

    @Query("""
                SELECT new com.example.mobileApp.dto.response.ReviewResponse(
                    r.id,
                    r.rating,
                    r.content,
                    r.imageUrl,
                    CONCAT(u.firstName, ' ', u.lastName)
                )
                FROM Review r
                JOIN r.user u
                WHERE r.user.id = :userId
            """)
    List<ReviewResponse> findProjectionsByUserId(@Param("userId") Long userId);
}
