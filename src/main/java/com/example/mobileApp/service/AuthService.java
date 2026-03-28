package com.example.mobileApp.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.request.ForgotPasswordRequest;
import com.example.mobileApp.dto.request.LoginRequest;
import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.request.ResetPasswordRequest;
import com.example.mobileApp.dto.response.LoginResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.UserMapper;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.google.web-client-id}")
    private String googleClientId;

    // register
    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationExpiry(LocalDateTime.now().plusHours(24));
        user.setVerified(false);

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);
    }

    // login
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getVerified()) {
            throw new RuntimeException("Account is not verified");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name());

        return new LoginResponse(token);
    }

    // verify account
    public void verifyAccount(String token) {

        User user = userRepository.findByVerificationToken(token)
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid verification token");
        }

        if (user.getVerificationExpiry() == null ||
                user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Link activation has expired.");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpiry(null);

        userRepository.save(user);
    }

    // forgot password
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return; // tránh leak thông tin email tồn tại hay không
        }

        SecureRandom random = new SecureRandom();
        String pin = String.valueOf(100000 + random.nextInt(900000));

        user.setResetPasswordToken(passwordEncoder.encode(pin));
        user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        emailService.sendResetEmail(user.getEmail(), user.getFullName(), pin);
    }

    // reset password
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (user.getResetPasswordToken() == null ||
                !passwordEncoder.matches(request.getPin(), user.getResetPasswordToken())) {
            throw new RuntimeException("Verification code is incorrect");
        }

        if (user.getResetPasswordExpiry() == null ||
                user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);

        userRepository.save(user);
    }
}