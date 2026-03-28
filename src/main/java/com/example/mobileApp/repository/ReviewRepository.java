package com.example.mobileApp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.mobileApp.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByAttractionId(Long attractionId, Pageable pageable);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    List<Review> findAllByUserId(Long userId);

    boolean existsByUserIdAndAttractionId(Long userId, Long attractionId);

    Integer countByAttractionId(Long attractionId);

    void deleteByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.attraction.id = :attractionId")
    Double getAverageRating(Long attractionId);
}