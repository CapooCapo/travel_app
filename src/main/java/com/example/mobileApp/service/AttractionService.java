package com.example.mobileApp.service;

import com.example.mobileApp.dto.AttractionDTO;
import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.repository.AttractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttractionService {

    private static final double RADIUS_METERS = 10_000.0; // 10 km

    private final AttractionRepository attractionRepository;

    public List<AttractionDTO> getNearbyAttractions(double lat, double lon) {
        List<Attraction> attractions = attractionRepository.findNearby(lat, lon, RADIUS_METERS);
        return attractions.stream()
                .map(this::toDTO)
                .toList();
    }

    private AttractionDTO toDTO(Attraction a) {
        List<String> imageUrls = a.getImages().stream()
                .map(img -> img.getImageUrl())
                .toList();

        return AttractionDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .description(a.getDescription())
                .images(imageUrls)
                .build();
    }
}
