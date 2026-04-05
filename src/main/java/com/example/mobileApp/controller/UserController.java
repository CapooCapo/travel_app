package com.example.mobileApp.controller;

import java.util.Set;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.dto.UserDTO;
import com.example.mobileApp.service.UserService;
import com.example.mobileApp.security.CurrentUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getUserProfile(@CurrentUser Long userId) {
        return ok(userService.getUserProfile(userId));
    }

    @GetMapping("/search")
    public ApiResponse<List<UserDTO>> searchUsers(@RequestParam("keyword") String keyword) {
        return ok(userService.searchUsers(keyword));
    }

    @PutMapping("/updateProfile")
    public ApiResponse<UserResponse> updateProfile(
            @CurrentUser Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ok(userService.updateUser(userId, request));
    }

    @PutMapping("/me/interests")
    public ApiResponse<UserResponse> updateInterests(
            @CurrentUser Long userId,
            @RequestBody Set<Long> interestIds) {
        return ok(userService.updateUserInterests(userId, interestIds));
    }

    @GetMapping("/me/data")
    public ApiResponse<UserDataResponse> exportUserData(
            @CurrentUser Long userId) {
        return ok(userService.exportUserData(userId));
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteAccount(
            @CurrentUser Long userId) {
        userService.deleteAccount(userId);
        return ok(null, "User account deleted successfully");
    }
}
