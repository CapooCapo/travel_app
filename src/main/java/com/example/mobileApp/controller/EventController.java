package com.example.mobileApp.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.EventRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.dto.response.PageResponse;
import com.example.mobileApp.security.CurrentUser;
import com.example.mobileApp.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventController extends BaseController {

    private final EventService eventService;

    @GetMapping
    public ApiResponse<PageResponse<EventResponse>> getEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String status, // Lifecycle status
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<EventResponse> result = eventService.getFilteredEvents(
                keyword, category, isFree, minPrice, maxPrice, 
                startDate, endDate, status, lat, lng, radius, page, size);
        return ok(PageResponse.of(result), "Success");
    }

    @GetMapping("/{id:[0-9]+}")
    public ApiResponse<EventResponse> getEventById(@PathVariable Long id) {
        return ok(eventService.getEventById(id));
    }

    @PostMapping
    public ApiResponse<EventResponse> createEvent(
            @CurrentUser Long userId,
            @Valid @RequestBody EventRequest request) {
        return ok(eventService.createEvent(request, userId), "Event created successfully");
    }

    @PutMapping("/{id:[0-9]+}")
    public ApiResponse<EventResponse> updateEvent(
            @CurrentUser Long userId,
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        return ok(eventService.updateEvent(id, request, userId), "Event updated successfully");
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ApiResponse<Void> deleteEvent(
            @CurrentUser Long userId,
            @PathVariable Long id) {
        eventService.deleteEvent(id, userId);
        return ok(null, "Event deleted successfully");
    }

    @GetMapping("/me")
    public ApiResponse<List<EventResponse>> getMyEvents(@CurrentUser Long userId) {
        return ok(eventService.getMyEvents(userId));
    }

    @GetMapping("/location/{locationId}")
    public ApiResponse<PageResponse<EventResponse>> getEventsByLocation(
            @PathVariable Long locationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ok(PageResponse.of(eventService.getEventsByLocation(locationId, page, size)));
    }
}