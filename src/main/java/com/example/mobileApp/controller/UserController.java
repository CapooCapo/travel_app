package com.example.mobileApp.controller;

import java.util.Set;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.request.UpdateAvatarRequest;
import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.dto.UserDTO;
import com.example.mobileApp.service.UserService;
import com.example.mobileApp.security.CurrentUser;

import org.springframework.web.bind.annotation.PostMapping;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class UserController extends BaseController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<com.example.mobileApp.dto.response.UserProfileDTO> getMyProfile(@CurrentUser Long userId) {
        log.info("[BE DEBUG] Fetching own profile - userId: {}", userId);
        return ok(userService.getUserDetailedProfile(userId, userId));
    }

    @GetMapping("/{userId}")
    public ApiResponse<com.example.mobileApp.dto.response.UserProfileDTO> getUserProfileById(@CurrentUser Long currentUserId, @PathVariable Long userId) {
        log.info("[BE DEBUG] Fetching profile - targetUserId: {}, requesterId: {}", userId, currentUserId);
        return ok(userService.getUserDetailedProfile(userId, currentUserId));
    }

    @GetMapping("/profile/{userId}")
    public ApiResponse<com.example.mobileApp.dto.response.UserProfileDTO> getUserProfileDetailed(@CurrentUser Long currentUserId, @PathVariable Long userId) {
        log.info("[BE DEBUG] Fetching detailed profile (legacy/explicit) - targetUserId: {}, requesterId: {}", userId, currentUserId);
        return ok(userService.getUserDetailedProfile(userId, currentUserId));
    }

    @PostMapping("/sync")
    public ApiResponse<com.example.mobileApp.dto.response.SyncResult> syncUser(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {
        log.info("[BE DEBUG] Syncing user: sub={}, email={}", jwt.getSubject(), jwt.getClaim("email"));
        return ok(userService.syncClerkUser(jwt));
    }

    @PostMapping("/search")
    public ApiResponse<List<UserDTO>> searchUsers(
            @CurrentUser Long currentUserId,
            @RequestBody com.example.mobileApp.dto.request.SearchRequest request) {
        return ok(userService.searchUsers(request.getQuery(), request.getLimit(), request.getOffset(), currentUserId));
    }

    @PutMapping("/updateProfile")
    public ApiResponse<UserResponse> updateProfile(
            @CurrentUser Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ok(userService.updateUser(userId, request));
    }

    @PutMapping("/avatar")
    public ApiResponse<UserResponse> updateAvatar(
            @CurrentUser Long userId,
            @Valid @RequestBody UpdateAvatarRequest request) {
        return ok(userService.updateAvatar(userId, request));
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
    @PostMapping("/{userId}/follow")
    public ApiResponse<Void> followUser(@CurrentUser Long currentUserId, @PathVariable Long userId) {
        log.info("[BE DEBUG] User {} following user {}", currentUserId, userId);
        userService.followUser(currentUserId, userId);
        return ok(null, "Successfully followed user");
    }

    @DeleteMapping("/{userId}/follow")
    public ApiResponse<Void> unfollowUser(@CurrentUser Long currentUserId, @PathVariable Long userId) {
        log.info("[BE DEBUG] User {} unfollowing user {}", currentUserId, userId);
        userService.unfollowUser(currentUserId, userId);
        return ok(null, "Successfully unfollowed user");
    }
}
