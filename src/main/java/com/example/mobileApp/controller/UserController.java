package com.example.mobileApp.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getUserProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userService.getUserProfile(userId);
    }
}
