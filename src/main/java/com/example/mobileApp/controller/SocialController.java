package com.example.mobileApp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    @GetMapping("/feed")
    public ApiResponse<?> getFeed(@RequestParam(defaultValue = "1") int page) {
        return new ApiResponse<>(200, "OK", null, System.currentTimeMillis());
    }
}