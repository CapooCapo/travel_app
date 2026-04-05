package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.AttractionImageResponse;
import com.example.mobileApp.repository.LocationImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationImageService {

    private final LocationImageRepository imageRepository;

    public List<AttractionImageResponse> getImages(Long locationId) {

        return imageRepository
                .findByLocationId(locationId)
                .stream()
                .map(img -> {
                    AttractionImageResponse r = new AttractionImageResponse();
                    r.setId(img.getId());
                    r.setImageUrl(img.getImageUrl());
                    return r;
                })
                .toList();
    }
}
