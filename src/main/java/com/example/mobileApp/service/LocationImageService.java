package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.LocationImageResponse;
import com.example.mobileApp.repository.LocationImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationImageService {

    private final LocationImageRepository imageRepository;

    public List<LocationImageResponse> getImages(Long locationId) {

        return imageRepository
                .findByLocationId(locationId)
                .stream()
                .map(img -> {
                    LocationImageResponse r = new LocationImageResponse();
                    r.setId(img.getId());
                    r.setImageUrl(img.getImageUrl());
                    return r;
                })
                .toList();
    }
}
