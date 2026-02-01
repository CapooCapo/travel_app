package com.example.mobileApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping; // Import Response đã tạo
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
import com.example.mobileApp.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/auth") 
@RequiredArgsConstructor 
public class AuthController {

    private final AuthService authService;

    //#region (register)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        
        return ResponseEntity.ok("Đăng ký thành công! Hãy kiểm tra email để kích hoạt tài khoản.");
    }
    //#endregion

    //#region (login)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    //#endregion

    //#region (verify account)
    @GetMapping("/verify")
    public ModelAndView verify(@RequestParam String token) {
        ModelAndView mav = new ModelAndView("verify-result");
        
        try {
            authService.verifyAccount(token); 
            
            mav.addObject("success", true);
            mav.addObject("message", "Tài khoản đã được kích hoạt thành công! Bạn có thể đăng nhập ngay.");
            
        } catch (RuntimeException e) {
            mav.addObject("success", false);
            mav.addObject("message", e.getMessage()); 
        }
        
        return mav;
    }
    //#endregion

    //#region (Forgot Password)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request); 
        return ResponseEntity.ok("Mã xác thực đã được gửi đến email của bạn.");
    }
    //#endregion

    //#region (Reset Password)
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.");
    }
    //#endregion
}