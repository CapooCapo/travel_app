package com.example.mobileApp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.AttractionImageResponse;
import com.example.mobileApp.service.AttractionImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attraction-images")
@RequiredArgsConstructor
public class AttractionImageController {

    private final AttractionImageService imageService;

    private <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(
                200,
                "OK",
                data,
                System.currentTimeMillis());
    }

    @GetMapping("/{id}/images")
    public ApiResponse<List<AttractionImageResponse>> getImages(
            @PathVariable Long id) {

        return ok(imageService.getImages(id));
    }
}