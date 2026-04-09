package com.example.mobileApp.controller;

import java.util.List;

import com.example.mobileApp.security.CurrentUser;
import org.springframework.web.bind.annotation.*;

import com.example.mobileApp.dto.request.AddItineraryItemRequest;
import com.example.mobileApp.dto.request.CreateItineraryRequest;
import com.example.mobileApp.dto.request.UpdateItineraryNotesRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.ItineraryItemResponse;
import com.example.mobileApp.dto.response.ItineraryResponse;
import com.example.mobileApp.service.ItineraryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // chỉnh lại domain FE của bạn
public class ItineraryController extends BaseController {

    private final ItineraryService itineraryService;

    // ================= CREATE =================
    @PostMapping
    public ApiResponse<ItineraryResponse> createItinerary(
            @CurrentUser Long userId,
            @Valid @RequestBody CreateItineraryRequest request) {

        ItineraryResponse response = itineraryService.createItinerary(userId, request);
        return created(response, "Itinerary created");
    }

    // ================= GET ALL =================
    @GetMapping
    public ApiResponse<List<ItineraryResponse>> getUserItineraries(
            @CurrentUser Long userId) {

        return ok(itineraryService.getUserItineraries(userId));
    }

    // ================= GET DETAIL =================
    @GetMapping("/{itineraryId:[0-9]+}")
    public ApiResponse<ItineraryResponse> getItinerary(
            @CurrentUser Long userId,
            @PathVariable Long itineraryId) {
        return ok(itineraryService.getItinerary(userId, itineraryId));
    }

    // ================= ADD ITEM =================
    @PostMapping("/{itineraryId:[0-9]+}/items")
    public ApiResponse<ItineraryItemResponse> addItem(
            @CurrentUser Long userId,
            @PathVariable Long itineraryId,
            @Valid @RequestBody AddItineraryItemRequest request) {
        return ok(itineraryService.addItem(userId, itineraryId, request));
    }

    // ================= DELETE ITEM =================
    @DeleteMapping("/{itineraryId:[0-9]+}/items/{itemId:[0-9]+}")
    public ApiResponse<Void> deleteItem(
            @CurrentUser Long userId,
            @PathVariable Long itineraryId,
            @PathVariable Long itemId) {
        itineraryService.deleteItem(userId, itemId);
        return ok(null);
    }

    // ================= DELETE ITINERARY =================
    @DeleteMapping("/{itineraryId:[0-9]+}")
    public ApiResponse<Void> deleteItinerary(
            @CurrentUser Long userId,
            @PathVariable Long itineraryId) {
        itineraryService.deleteItinerary(userId, itineraryId);
        return ok(null);
    }

    // ================= UPDATE NOTES =================
    @PutMapping("/{itineraryId:[0-9]+}/notes")
    public ApiResponse<Void> updateNotes(
            @CurrentUser Long userId,
            @PathVariable Long itineraryId,
            @Valid @RequestBody UpdateItineraryNotesRequest request) {
        itineraryService.updateItineraryNotes(userId, itineraryId, request.getNotes());
        return ok(null);
    }

    // ================= SHARE =================
    @PostMapping("/{itineraryId:[0-9]+}/share")
    public ApiResponse<String> share(
            @CurrentUser Long userId,
            @PathVariable Long itineraryId) {
        return ok(itineraryService.shareItinerary(userId, itineraryId));
    }
}