package com.example.mobileApp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/social")
public class SocialController extends BaseController {

    @GetMapping("/feed")
    public ApiResponse<Void> getFeed(@RequestParam(defaultValue = "1") int page) {
        return ok(null, "OK");
    }
}