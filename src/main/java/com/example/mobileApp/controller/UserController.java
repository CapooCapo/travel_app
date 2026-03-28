package com.example.mobileApp.controller;

import java.util.Set;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getUserProfile(@AuthenticationPrincipal Long userId) {
        return userService.getUserProfile(userId);
    }

    @PutMapping("/updateProfile")
    public UserResponse updateProfile(
            @AuthenticationPrincipal Long userId,
            @RequestBody UpdateUserRequest request) {

        return userService.updateUser(userId, request);
    }

    @PutMapping("/me/interests")
    public UserResponse updateInterests(
            @AuthenticationPrincipal Long userId,
            @RequestBody Set<Long> interestIds) {

        return userService.updateUserInterests(userId, interestIds);
    }

    @GetMapping("/me/data")
    public UserDataResponse exportUserData(
            @AuthenticationPrincipal Long userId) {

        return userService.exportUserData(userId);
    }
}
