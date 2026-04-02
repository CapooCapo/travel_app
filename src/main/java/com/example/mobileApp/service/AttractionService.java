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

import com.example.mobileApp.dto.request.CreateAttractionRequest;
import com.example.mobileApp.dto.response.AiRecommendationResponse;
import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.AttractionMapper;
import com.example.mobileApp.repository.AttractionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttractionService {

    private final OsmService osmService;
    private final GeminiService geminiService;
    private final AttractionRepository attractionRepository;
    private final AttractionMapper mapper;

    // Hỗ trợ hằng số bán kính từ bản local nếu cần dùng cho logic cũ
    private static final double RADIUS_METERS = 50_000.0;

    public Page<AttractionResponse> getAttractions(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("ratingAverage").descending());

        return attractionRepository
                .findAll(pageable)
                .map(mapper::toResponse);
    }

    public AttractionResponse getAttraction(Long id) {
        Attraction attraction = attractionRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Attraction not found with id: " + id));

        return mapper.toDetailResponse(attraction);
    }

    public Page<AttractionResponse> getNearbyAttractions(Double lat, Double lng, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return attractionRepository
                .findNearby(lat, lng, RADIUS_METERS, pageable)
                .map(mapper::toResponse);
    }

    public List<AttractionResponse> getNearbyRaw(Double lat, Double lng) {
        Pageable topTen = PageRequest.of(0, 10);
        return attractionRepository
                .findNearby(lat, lng, RADIUS_METERS, topTen)
                .map(mapper::toResponse)
                .getContent();
    }

    @Transactional
    public AttractionResponse createAttraction(CreateAttractionRequest request) {
        Attraction attraction = new Attraction();
        attraction.setName(request.getName());
        attraction.setAddress(request.getAddress());
        attraction.setDescription(request.getDescription());
        attraction.setLatitude(request.getLatitude());
        attraction.setLongitude(request.getLongitude());
        attraction.setRatingAverage(0.0);
        attraction.setReviewCount(0);

        attractionRepository.save(attraction);

        return mapper.toResponse(attraction);
    }

    public Page<AttractionResponse> search(
            String keyword,
            Double rating,
            Pageable pageable) {
        Page<Attraction> result;

        if (keyword != null) {
            result = attractionRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (rating != null) {
            result = attractionRepository.findByRatingAverageGreaterThanEqual(rating, pageable);
        } else {
            result = attractionRepository.findAll(pageable);
        }

        return result.map(mapper::toResponse);
    }

    public Page<AttractionResponse> getAttractionsByInterest(
            Set<Long> interestIds,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return attractionRepository
                .findByInterests(interestIds, pageable)
                .map(mapper::toResponse);
    }

    public Page<AttractionResponse> getPopularAttractions(int page, int size) {
        return attractionRepository
                .findAllByOrderByRatingAverageDesc(PageRequest.of(page, size))
                .map(mapper::toResponse);
    }

    public List<AiRecommendationResponse> getAiRecommendations(Double lat, Double lng, User user) {

        // 1. Nếu user KHÔNG có interest → trả nearby luôn
        if (user.getInterests() == null || user.getInterests().isEmpty()) {

            List<AttractionResponse> nearby = getNearbyRaw(lat, lng);

            return nearby.stream()
                    .map(a -> {
                        AiRecommendationResponse res = new AiRecommendationResponse();
                        res.setAttraction(a);
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

        List<AttractionResponse> nearbyRaw = getNearbyRaw(lat, lng);

        if (nearbyRaw == null || nearbyRaw.isEmpty()) {
            return Collections.emptyList();
        }

        return geminiService.process(interestNames, nearbyRaw);
    }
}