package com.example.mobileApp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.request.CreateReviewRequest;
import com.example.mobileApp.dto.response.ReviewResponse;
import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.entity.Review;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.ReviewMapper;
import com.example.mobileApp.repository.AttractionRepository;
import com.example.mobileApp.repository.ReviewRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final ReviewMapper reviewMapper;

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviews(Long attractionId, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending());

        return reviewRepository
                .findByAttractionId(attractionId, pageable)
                .map(reviewMapper::toResponse);
    }

    private void updateAttractionRating(Long attractionId) {

        Double avg = reviewRepository.getAverageRating(attractionId);
        Integer count = reviewRepository.countByAttractionId(attractionId);

        Attraction attraction = attractionRepository
                .findById(attractionId)
                .orElseThrow();

        attraction.setRatingAverage(avg != null ? avg : 0.0);
        attraction.setReviewCount(count);

        attractionRepository.save(attraction);
    }

    @Transactional
    public void createReview(Long userId, Long attractionId, CreateReviewRequest request) {

        if (reviewRepository.existsByUserIdAndAttractionId(userId, attractionId)) {
            throw new RuntimeException("User already reviewed this attraction");
        }

        User user = userRepository
                .findById(userId)
                .orElseThrow();

        Attraction attraction = attractionRepository
                .findById(attractionId)
                .orElseThrow();

        Review review = new Review();
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setImageUrl(request.getImageUrl());
        review.setUser(user);
        review.setAttraction(attraction);

        reviewRepository.save(review);

        updateAttractionRating(attractionId);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getUserReviews(Long userId, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending());

        return reviewRepository
                .findByUserId(userId, pageable)
                .map(reviewMapper::toResponse);
    }
}