package com.example.mobileApp.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.mobileApp.dto.request.CreateAttractionRequest;
import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.mapper.AttractionMapper;
import com.example.mobileApp.repository.AttractionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttractionService {

        private final AttractionRepository attractionRepository;
        private final AttractionMapper mapper;

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

        public Page<AttractionResponse> getNearbyAttractions(
                        Double lat,
                        Double lng,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return attractionRepository
                                .findNearby(lat, lng, pageable)
                                .map(mapper::toResponse);
        }

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

        public List<AttractionResponse> getNearbyRaw(Double lat, Double lng) {
                // Lấy tối đa 10 địa điểm gần nhất để gửi cho AI phân tích
                Pageable topTen = PageRequest.of(0, 10);
                return attractionRepository
                                .findNearby(lat, lng, topTen)
                                .map(mapper::toResponse)
                                .getContent();
        }
}