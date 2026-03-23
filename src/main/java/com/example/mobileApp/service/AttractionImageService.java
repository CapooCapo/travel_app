package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.AttractionImageResponse;
import com.example.mobileApp.repository.AttractionImageRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AttractionImageService {

    private final AttractionImageRepository imageRepository;

    public List<AttractionImageResponse> getImages(Long attractionId) {

        return imageRepository
                .findByAttractionId(attractionId)
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