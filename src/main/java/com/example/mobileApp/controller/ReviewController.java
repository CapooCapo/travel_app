package com.example.mobileApp.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.CreateReviewRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.PageResponse;
import com.example.mobileApp.dto.response.ReviewResponse;
import com.example.mobileApp.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    private <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(200, message, data, System.currentTimeMillis());
    }

    @PostMapping("/{id}/reviews")
    public ApiResponse<Void> createReview(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CreateReviewRequest request) {

        reviewService.createReview(userId, id, request);
        return ok(null, "Review created");
    }

    @GetMapping("/{id}/reviews")
    public ApiResponse<PageResponse<ReviewResponse>> getReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ReviewResponse> result =
                reviewService.getReviews(id, page, size);

        return ok(PageResponse.of(result), "Success");
    }
}