package com.example.mobileApp.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.*;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.mobileApp.dto.request.CreateAttractionRequest;
import com.example.mobileApp.dto.response.*;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.service.AttractionService;

import lombok.RequiredArgsConstructor;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/attractions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AttractionController extends BaseController {

    private final AttractionService attractionService;
    private final UserRepository userRepository;

    // ========================
    // BASIC APIs
    // ========================

    @GetMapping
    public ApiResponse<Page<AttractionResponse>> getAllAttractions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(attractionService.getAttractions(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<AttractionResponse> getAttraction(@PathVariable Long id) {
        return ok(attractionService.getAttraction(id));
    }

    @GetMapping("/search")
    public ApiResponse<Page<AttractionResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ok(attractionService.search(keyword, rating, pageable));
    }

    // ========================
    // NEARBY
    // ========================

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<Page<AttractionResponse>>> getNearbyAttractions(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AttractionResponse> data =
                attractionService.getNearbyAttractions(lat, lng, page, size);

        return ResponseEntity.ok()
                // ✅ cache browser 2 phút
                .cacheControl(CacheControl.maxAge(2, TimeUnit.MINUTES))
                .body(ok(data));
    }

    // ========================
    // CREATE
    // ========================

    @PostMapping
    public ApiResponse<AttractionResponse> createAttraction(
            @RequestBody CreateAttractionRequest request) {

        return ok(attractionService.createAttraction(request));
    }

    // ========================
    // INTEREST
    // ========================

    @PostMapping("/by-interests")
    public ApiResponse<Page<AttractionResponse>> getByInterests(
            @RequestBody Set<Long> interestIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(attractionService.getAttractionsByInterest(interestIds, page, size));
    }

    @GetMapping("/popular")
    public ApiResponse<Page<AttractionResponse>> getPopular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(attractionService.getPopularAttractions(page, size));
    }

    // ========================
    // AI RECOMMEND (QUAN TRỌNG)
    // ========================

    @GetMapping("/ai-recommend")
    public ResponseEntity<ApiResponse<List<AiRecommendationResponse>>> getAiRecommend(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @org.springframework.security.core.annotation.AuthenticationPrincipal Long userId
    ) {

        User user = userRepository.findByIdWithInterests(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + userId));

        List<AiRecommendationResponse> result =
                attractionService.getAiRecommendations(lat, lng, user);

        return ResponseEntity.ok()
                // ✅ cache browser 3 phút (GIẢM REFRESH CALL API)
                .cacheControl(CacheControl.maxAge(3, TimeUnit.MINUTES))
                .body(ok(result));
    }
}