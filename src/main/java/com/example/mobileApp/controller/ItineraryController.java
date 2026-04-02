package com.example.mobileApp.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.AddItineraryItemRequest;
import com.example.mobileApp.dto.request.CreateItineraryRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.ItineraryItemResponse;
import com.example.mobileApp.dto.response.ItineraryResponse;
import com.example.mobileApp.service.ItineraryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/itineraries")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ItineraryController extends BaseController {

    private final ItineraryService itineraryService;

    @PostMapping
    public ApiResponse<ItineraryResponse> createItinerary(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody CreateItineraryRequest request) {
        return created(itineraryService.createItinerary(userId, request), "Itinerary created");
    }

    @GetMapping
    public ApiResponse<List<ItineraryResponse>> getUserItineraries(
            @AuthenticationPrincipal Long userId) {
        return ok(itineraryService.getUserItineraries(userId));
    }

    @GetMapping("/{id}")
    public ApiResponse<ItineraryResponse> getItinerary(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id) {
        return ok(itineraryService.getItinerary(userId, id));
    }

    @PostMapping("/{id}/items")
    public ApiResponse<ItineraryItemResponse> addItem(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @Valid @RequestBody AddItineraryItemRequest request) {
        return ok(itineraryService.addItem(userId, id, request), "Item added to itinerary");
    }

    // Standardized REST path instead of root /items
    @DeleteMapping("/items/{itemId}")
    public ApiResponse<Void> deleteItem(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long itemId) {
        itineraryService.deleteItem(userId, itemId);
        return ok(null, "Item removed from itinerary");
    }
}
