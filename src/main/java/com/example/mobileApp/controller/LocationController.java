package com.example.mobileApp.controller;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.CreateLocationRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.LocationResponse;
import com.example.mobileApp.dto.response.AiRecommendationResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.security.CurrentUser;
import com.example.mobileApp.service.LocationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LocationController extends BaseController {

    private final LocationService locationService;
    private final UserRepository userRepository;

    @GetMapping
    public ApiResponse<Page<LocationResponse>> getLocations(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (keyword != null || rating != null) {
            Pageable pageable = PageRequest.of(page, size);
            return ok(locationService.search(keyword, rating, pageable));
        }
        return ok(locationService.getLocations(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<LocationResponse> getLocation(@PathVariable Long id) {
        return ok(locationService.getLocation(id));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<Page<LocationResponse>>> getNearbyLocations(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<LocationResponse> data =
                locationService.getNearbyLocations(lat, lng, page, size);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(2, TimeUnit.MINUTES))
                .body(ok(data));
    }

    @PostMapping
    public ApiResponse<LocationResponse> createLocation(
            @RequestBody CreateLocationRequest request) {

        return ok(locationService.createLocation(request));
    }

    @PostMapping("/by-interests")
    public ApiResponse<Page<LocationResponse>> getByInterests(
            @RequestBody Set<Long> interestIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(locationService.getLocationsByInterest(interestIds, page, size));
    }

    @GetMapping("/popular")
    public ApiResponse<Page<LocationResponse>> getPopular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ok(locationService.getPopularLocations(page, size));
    }

    @GetMapping("/ai-recommend")
    public ResponseEntity<ApiResponse<List<AiRecommendationResponse>>> getAiRecommend(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @CurrentUser Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<AiRecommendationResponse> result =
                locationService.getAiRecommendations(lat, lng, user);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(3, TimeUnit.MINUTES))
                .body(ok(result));
    }
}
