package com.example.mobileApp.controller;

import java.util.Set;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getUserProfile(@AuthenticationPrincipal Long userId) {
        return ok(userService.getUserProfile(userId));
    }

    @PutMapping("/updateProfile")
    public ApiResponse<UserResponse> updateProfile(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ok(userService.updateUser(userId, request));
    }

    @PutMapping("/me/interests")
    public ApiResponse<UserResponse> updateInterests(
            @AuthenticationPrincipal Long userId,
            @RequestBody Set<Long> interestIds) {
        return ok(userService.updateUserInterests(userId, interestIds));
    }

    @GetMapping("/me/data")
    public ApiResponse<UserDataResponse> exportUserData(
            @AuthenticationPrincipal Long userId) {
        return ok(userService.exportUserData(userId));
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteAccount(
            @AuthenticationPrincipal Long userId) {
        userService.deleteAccount(userId);
        return ok(null, "Account deleted successfully");
    }
}
