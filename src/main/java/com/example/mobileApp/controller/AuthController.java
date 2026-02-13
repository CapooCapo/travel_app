package com.example.mobileApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.mobileApp.dto.request.ForgotPasswordRequest;
import com.example.mobileApp.dto.request.LoginRequest;
import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.request.ResetPasswordRequest;
import com.example.mobileApp.dto.response.AuthResponse;
import com.example.mobileApp.dto.response.LoginResponse;
import com.example.mobileApp.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    

    // #region (register)
    @PostMapping("/register")
    public AuthResponse<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);

        return new AuthResponse<>(200, "registered successfully! Please check your email to verify your account.", null);
    }
    // #endregion

    // #region (login)
    @PostMapping("/login")
    public AuthResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    // #endregion

    // #region (verify account)
    @GetMapping("/verify")
    public ModelAndView verify(@RequestParam String token) {
        ModelAndView mav = new ModelAndView("verify-result");

        try {
            authService.verifyAccount(token);

            mav.addObject("success", true);
            mav.addObject("message", "Account has been successfully activated! You can now log in.");

        } catch (RuntimeException e) {
            mav.addObject("success", false);
            mav.addObject("message", e.getMessage());
        }

        return mav;
    }
    // #endregion

    @GetMapping("/verify-json")
    public ResponseEntity<AuthResponse<Void>> verifyJson(@RequestParam String token) {
        authService.verifyAccount(token);
        return ResponseEntity.ok(new AuthResponse<>(200, "Account verified", null));
    }

    // #region (Forgot Password)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Verification code has been sent to your email.");
    }
    // #endregion

    // #region (Reset Password)
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password has been reset successfully! Please log in with your new password.");
    }
    // #endregion
}