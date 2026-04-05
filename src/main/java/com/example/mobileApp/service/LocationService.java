package com.example.mobileApp.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.mobileApp.dto.request.CreateLocationRequest;
import com.example.mobileApp.dto.response.AiRecommendationResponse;
import com.example.mobileApp.dto.response.LocationResponse;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.LocationMapper;
import com.example.mobileApp.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final OsmService osmService;
    private final GeminiService geminiService;
    private final LocationRepository locationRepository;
    private final LocationMapper mapper;

    // Hỗ trợ hằng số bán kính từ bản local nếu cần dùng cho logic cũ
    private static final double RADIUS_METERS = 50_000.0;

    public Page<LocationResponse> getLocations(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("ratingAverage").descending());

        return locationRepository
                .findAll(pageable)
                .map(mapper::toResponse);
    }

    public LocationResponse getLocation(Long id) {
        Location location = locationRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Location not found with id: " + id));

        return mapper.toDetailResponse(location);
    }

    public Page<LocationResponse> getNearbyLocations(Double lat, Double lng, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return locationRepository
                .findNearby(lat, lng, RADIUS_METERS, pageable)
                .map(mapper::toResponse);
    }

    public List<LocationResponse> getNearbyRaw(Double lat, Double lng) {
        Pageable topTen = PageRequest.of(0, 10);
        return locationRepository
                .findNearby(lat, lng, RADIUS_METERS, topTen)
                .map(mapper::toResponse)
                .getContent();
    }

    @Transactional
    public LocationResponse createLocation(CreateLocationRequest request) {
        Location location = new Location();
        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setDescription(request.getDescription());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setRatingAverage(0.0);
        location.setReviewCount(0);

        locationRepository.save(location);

        return mapper.toResponse(location);
    }

    public Page<LocationResponse> search(
            String keyword,
            Double rating,
            Pageable pageable) {
        Page<Location> result;

        if (keyword != null) {
            result = locationRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (rating != null) {
            result = locationRepository.findByRatingAverageGreaterThanEqual(rating, pageable);
        } else {
            result = locationRepository.findAll(pageable);
        }

        return result.map(mapper::toResponse);
    }

    public Page<LocationResponse> getLocationsByInterest(
            Set<Long> interestIds,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return locationRepository
                .findByInterests(interestIds, pageable)
                .map(mapper::toResponse);
    }

    public Page<LocationResponse> getPopularLocations(int page, int size) {
        return locationRepository
                .findAllByOrderByRatingAverageDesc(PageRequest.of(page, size))
                .map(mapper::toResponse);
    }

    public List<AiRecommendationResponse> getAiRecommendations(Double lat, Double lng, User user) {

        // 1. Nếu user KHÔNG có interest → trả nearby luôn
        if (user.getInterests() == null || user.getInterests().isEmpty()) {

            List<LocationResponse> nearby = getNearbyRaw(lat, lng);

            return nearby.stream()
                    .map(a -> {
                        AiRecommendationResponse res = new AiRecommendationResponse();
                        res.setLocation(a);
                        res.setReason("Popular nearby place"); // hoặc bỏ cũng được
                        return res;
                    })
                    .toList();
        }

        // 2. Nếu có interest → xử lý như cũ
        Set<String> interestNames = user.getInterests().stream()
                .map(i -> i.getName())
                .collect(Collectors.toSet());

        CompletableFuture<Void> osmTask = osmService.fetchAndSaveNearbyPlacesAsync(lat, lng);

        try {
            osmTask.get(5, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            System.out.println("⚠️ OSM timeout -> dùng data cũ");
        } catch (Exception e) {
            System.err.println("❌ OSM error: " + e.getMessage());
        }

        List<LocationResponse> nearbyRaw = getNearbyRaw(lat, lng);

        if (nearbyRaw == null || nearbyRaw.isEmpty()) {
            return Collections.emptyList();
        }

        return geminiService.process(interestNames, nearbyRaw);
    }
}
