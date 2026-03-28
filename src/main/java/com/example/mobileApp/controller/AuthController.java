package com.example.mobileApp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

import com.example.mobileApp.dto.request.ForgotPasswordRequest;
import com.example.mobileApp.dto.request.GoogleLoginRequest;
import com.example.mobileApp.dto.request.LoginRequest;
import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.request.ResetPasswordRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.LoginResponse;
import com.example.mobileApp.service.AuthService;
import com.example.mobileApp.service.GoogleAuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;

    private <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(
                200,
                message,
                data,
                System.currentTimeMillis());
    }

    // register
    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ok(null, "Registered successfully. Check email to verify.");
        } catch (Exception e) {
            e.printStackTrace(); // log ra console
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    // login
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ok(authService.login(request), "Login successful");
    }

    // verify account (HTML)
    @GetMapping("/verify")
    public ModelAndView verify(@RequestParam String token) {

        ModelAndView mav = new ModelAndView("verify-result");

        try {
            authService.verifyAccount(token);
            mav.addObject("success", true);
            mav.addObject("message", "Account activated. You can log in.");
        } catch (RuntimeException e) {
            mav.addObject("success", false);
            mav.addObject("message", e.getMessage());
        }

        return mav;
    }

    // verify account (JSON)
    @GetMapping("/verify-json")
    public ApiResponse<Void> verifyJson(@RequestParam String token) {
        authService.verifyAccount(token);
        return ok(null, "Account verified");
    }

    // forgot password
    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ok(null, "Verification code sent to email");
    }

    // reset password
    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ok(null, "Password reset successful");
    }

    // login google
    @PostMapping("/google")
    public ApiResponse<LoginResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return ok(
                googleAuthService.loginWithGoogle(request.getIdToken()),
                "Login successful");
    }
}