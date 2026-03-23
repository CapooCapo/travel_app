package com.example.mobileApp.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.CreateAttractionRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.service.AttractionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;

    private <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(
                200,
                "OK",
                data,
                System.currentTimeMillis());
    }

    @GetMapping("/{id}")
    public ApiResponse<AttractionResponse> getAttraction(@PathVariable Long id) {
        return ok(attractionService.getAttraction(id));
    }

    @GetMapping
    public ApiResponse<Page<AttractionResponse>> getAttractions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(attractionService.search(keyword, rating, page, size));
    }

    @GetMapping("/nearby")
    public ApiResponse<Page<AttractionResponse>> getNearbyAttractions(
            @RequestParam Double lat,
            @RequestParam Double lng,
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

        return ok(attractionService.getAttractionsByInterest(
                interestIds, page, size));
    }

    @GetMapping("/popular")
    public ApiResponse<Page<AttractionResponse>> getPopular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(attractionService.getPopularAttractions(page, size));
    }

    @GetMapping("/recommend")
    public ApiResponse<Page<AttractionResponse>> recommend(
            @RequestParam Set<Long> interestIds,
            @RequestParam int page,
            @RequestParam int size) {

        return ok(attractionService
                .getAttractionsByInterest(interestIds, page, size));
    }
}