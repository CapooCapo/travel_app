package com.example.mobileApp.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.SyncResult;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController extends BaseController {

    private final UserService userService;

    /**
     * Endpoint for synchronizing Clerk User with Backend.
     * Publicly accessible but requires valid Clerk JWT (handled by SecurityConfig).
     */
    @PostMapping("/sync")
    public ApiResponse<User> syncUser(@AuthenticationPrincipal Jwt jwt) {
        SyncResult result = userService.syncClerkUser(jwt);
        String message = result.isNew() ? "Successfully Synced" : "Already Up-to-date";
        return ok(result.getUser(), message);
    }
}
