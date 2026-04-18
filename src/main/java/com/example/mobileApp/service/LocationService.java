package com.example.mobileApp.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Optional;

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
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.util.OsmTagMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class LocationService {

    private final OsmService osmService;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final LocationMapper mapper;
    private final OsmTagMapper osmTagMapper;

    private static final double RADIUS_METERS = 100_000.0;

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
        // 🛡️ IDEMPOTENCY CHECK:
        // 1. Check by External Identifier (e.g. Google Place ID)
        if (request.getExternalId() != null && request.getSource() != null) {
            Optional<Location> existingByExt = locationRepository.findByExternalIdAndSource(
                request.getExternalId(), request.getSource());
            if (existingByExt.isPresent()) {
                log.info("Found existing location by External ID: {}", request.getExternalId());
                return mapper.toResponse(existingByExt.get());
            }
        }

        // 2. Check by Name and Address fallback
        Optional<Location> existingByNameAddr = locationRepository.findByName(request.getName())
            .filter(l -> l.getAddress() != null && l.getAddress().equals(request.getAddress()));
        if (existingByNameAddr.isPresent()) {
            log.info("Found existing location by Name and Address: {}", request.getName());
            return mapper.toResponse(existingByNameAddr.get());
        }

        // 3. Create new if not found
        Location location = new Location();
        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setDescription(request.getDescription());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setExternalId(request.getExternalId());
        location.setSource(request.getSource());
        location.setPhone(request.getPhone());
        location.setWebsite(request.getWebsite());
        location.setRatingAverage(0.0);
        location.setReviewCount(0);

        locationRepository.save(location);
        log.info("Created new location: {} (Source: {})", request.getName(), request.getSource());

        return mapper.toResponse(location);
    }

    public Page<LocationResponse> search(
            String keyword,
            String category,
            Double rating,
            Pageable pageable) {
        Page<Location> result;

        if (category != null && !category.isEmpty()) {
            log.info("Filtering locations by category: {}", category);
            result = locationRepository.findByInterestsName(category, pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
            log.info("Searching locations by keyword: {}", keyword);
            result = locationRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (rating != null) {
            log.info("Filtering locations by rating >= {}", rating);
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

    @Transactional
    public List<AiRecommendationResponse> getAiRecommendations(Double lat, Double lng, Long userId) {
        // 1. Fetch user to ensure existence
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // 2. Create "cleansed" version with empty interests to ignore preferences
        User cleansedUser = new User();
        cleansedUser.setId(user.getId());
        cleansedUser.setInterests(Collections.emptySet());

        // 3. Fetch nearby locations based on proximity only
        List<LocationResponse> candidates = getNearbyFromOsm(cleansedUser, lat, lng);

        if (candidates.isEmpty()) {
            return Collections.emptyList();
        }

        // 4. Return top 10 results (AI disabled logic)
        return candidates.stream()
                .limit(10)
                .map(c -> AiRecommendationResponse.builder()
                        .locationId(c.getId())
                        .name(c.getName())
                        .latitude(c.getLatitude())
                        .longitude(c.getLongitude())
                        .address(c.getAddress())
                        .category(c.getCategory())
                        .reason("Nearby place (AI disabled)")
                        .build())
                .toList();
    }

    /**
     * ✅ Optimized retrieval logic: Checks local DB first (Cache Hit) before hitting
     * OSM API.
     */
    @Transactional
    public List<LocationResponse> getNearbyFromOsm(User user, Double lat, Double lng) {
        Long userId = user.getId();
        Set<String> interestNames = user.getInterests() != null
                ? user.getInterests().stream().map(i -> i.getName()).collect(Collectors.toSet())
                : Collections.emptySet();

        // 1. Map Interests to OSM tags
        Set<String> tags = osmTagMapper.mapInterestsToTags(interestNames);

        // 🚀 INTELLIGENT CACHE CHECK (Local-First)
        // We look for local POIs matching the current user's interests within 5km.
        double localCheckRadius = 5000.0;
        List<Location> localPoisByInterest = interestNames.isEmpty()
                ? locationRepository.findNearby(lat, lng, localCheckRadius, PageRequest.of(0, 15)).getContent()
                : locationRepository.findNearbyByInterests(lat, lng, localCheckRadius, interestNames);

        if (localPoisByInterest.size() >= 12) {
            log.info("🔍 [User: {}] Cache Hit: Found {} POIs locally for interests. Skipping OSM call.", userId,
                    localPoisByInterest.size());
            return localPoisByInterest.stream()
                    .map(mapper::toResponse)
                    .toList();
        }

        log.info("🌐 [User: {}] Cache Miss (Only {} POIs locally). Fetching from OSM...", userId,
                localPoisByInterest.size());

        // 2. Call OSM Service
        List<Location> osmLocations;
        try {
            osmLocations = osmService.fetchNearbyPois(lat, lng, tags, userId);
        } catch (Exception e) {
            log.error("🛡️ [User: {}] OSM API failed, falling back to all nearby local POIs: {}", userId,
                    e.getMessage());
            osmLocations = locationRepository.findNearby(lat, lng, 10000.0, PageRequest.of(0, 20)).getContent();
        }

        // Merge and deduplicate results
        Set<String> seenExternalIds = osmLocations.stream()
                .map(Location::getExternalId)
                .collect(Collectors.toSet());

        List<LocationResponse> result = new ArrayList<>(osmLocations.stream()
                .map(mapper::toResponse)
                .toList());

        for (Location local : localPoisByInterest) {
            if (local.getExternalId() != null && !seenExternalIds.contains(local.getExternalId())) {
                result.add(mapper.toResponse(local));
            }
        }

        return result;
    }

    @Transactional
    public List<LocationResponse> getNearbyFromOsm(Long userId, Double lat, Double lng) {
        User user = userRepository.findWithInterestsById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return getNearbyFromOsm(user, lat, lng);
    }
}
