package com.example.mobileApp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.LocationImageResponse;
import com.example.mobileApp.service.LocationImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LocationImageController extends BaseController {

    private final LocationImageService imageService;

    @GetMapping("/{id:[0-9]+}/images")
    public ApiResponse<List<LocationImageResponse>> getImages(
            @PathVariable Long id) {
        return ok(imageService.getImages(id));
    }
}
