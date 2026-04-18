package com.example.mobileApp.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ActivityResponse;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.security.CurrentUser;
import com.example.mobileApp.service.FeedService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController extends BaseController {

    private final FeedService feedService;

    @GetMapping("/feed")
    public ApiResponse<Page<ActivityResponse>> getFeed(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return ok(feedService.getFeed(userId, page, size));
    }
}