package com.example.mobileApp.service;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
                                .orElseThrow();

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
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return attractionRepository
                                .searchAttractions(keyword, rating, pageable)
                                .map(mapper::toResponse);
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

}