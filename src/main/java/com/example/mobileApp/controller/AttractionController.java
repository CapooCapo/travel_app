package com.example.mobileApp.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.mobileApp.dto.request.CreateAttractionRequest;
import com.example.mobileApp.dto.response.AiRecommendationResponse;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.entity.Interest;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.service.AttractionService;
import com.example.mobileApp.service.GeminiService;
import com.example.mobileApp.service.OsmService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attractions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;
    private final GeminiService geminiService;
    private final OsmService osmService;

    // Helper method để đóng gói response chuẩn
    private <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(
                200,
                "OK",
                data,
                System.currentTimeMillis());
    }

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

    @GetMapping("/nearby")
    public ApiResponse<Page<AttractionResponse>> getNearbyAttractions(
            @RequestParam Double lat,
            @RequestParam Double lng, // Đổi từ lon sang lng để đồng bộ với Service
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ok(attractionService.getNearbyAttractions(lat, lng, page, size));
    }

    @PostMapping
    public ApiResponse<AttractionResponse> createAttraction(
            @RequestBody CreateAttractionRequest request) {
        return ok(attractionService.createAttraction(request));
    }

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

    @GetMapping("/ai-recommend")
    public ApiResponse<List<AiRecommendationResponse>> getAiRecommend(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @AuthenticationPrincipal User user) {

        if (user == null || user.getInterests() == null) {
            return ok(java.util.Collections.emptyList());
        }

        // 1. Quét DB cục bộ
        List<AttractionResponse> nearby = attractionService.getNearbyRaw(lat, lng);

        // 2. Tự động cào dữ liệu từ OpenStreetMap (OSM) nếu DB trống
        if (nearby.isEmpty()) {
            osmService.fetchAndSaveNearbyPlaces(lat, lng);
            nearby = attractionService.getNearbyRaw(lat, lng);
        }

        // 3. Sử dụng Gemini AI để lọc và gợi ý dựa trên sở thích User
        Set<String> interestNames = user.getInterests().stream()
                .map(Interest::getName)
                .collect(Collectors.toSet());

        return ok(geminiService.process(interestNames, nearby));
    }
}