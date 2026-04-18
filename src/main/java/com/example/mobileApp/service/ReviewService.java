package com.example.mobileApp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.request.CreateReviewRequest;
import com.example.mobileApp.dto.response.ReviewResponse;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Review;
import com.example.mobileApp.entity.TargetType;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.ReviewMapper;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.ReviewRepository;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.entity.ActivityType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final ReviewMapper reviewMapper;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviews(Long locationId, int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending());

        return reviewRepository
                .findByLocationId(locationId, pageable)
                .map(reviewMapper::toResponse);
    }

    private void updateLocationRating(Long locationId) {

        Double avg = reviewRepository.getAverageRating(locationId);
        Integer count = reviewRepository.countByLocationId(locationId);

        Location location = locationRepository
                .findById(locationId)
                .orElseThrow();

        location.setRatingAverage(avg != null ? avg : 0.0);
        location.setReviewCount(count);

        locationRepository.save(location);
    }

    @Transactional
    public void createReview(Long userId, Long locationId, CreateReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.example.mobileApp.exception.ResourceNotFoundException("User not found: " + userId));

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new com.example.mobileApp.exception.ResourceNotFoundException("Location not found: " + locationId));

        // 🛡️ Idempotent UPSERT Logic
        Review review = reviewRepository.findByUserIdAndLocationId(userId, locationId)
                .map(existing -> {
                    existing.setRating(request.getRating());
                    existing.setContent(request.getContent());
                    existing.setImageUrl(request.getImageUrl());
                    return existing;
                })
                .orElseGet(() -> {
                    Review newReview = new Review();
                    newReview.setUser(user);
                    newReview.setLocation(location);
                    newReview.setRating(request.getRating());
                    newReview.setContent(request.getContent());
                    newReview.setImageUrl(request.getImageUrl());
                    return newReview;
                });

        reviewRepository.save(review);

        // 📝 Record Activity (Idempotent via ActivityService check)
        activityService.recordActivity(
                userId,
                ActivityType.REVIEW_CREATED,
                TargetType.LOCATION,
                locationId,
                "Reviewed: " + location.getName()
        );

        updateLocationRating(locationId);
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