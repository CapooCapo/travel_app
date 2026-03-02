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
import com.example.mobileApp.dto.response.AuthResponse;
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

    // #region (register)
    public void register(RegisterRequest request) {
        // checking email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }
        // get data from mapper
        User user = userMapper.toUser(request);
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // create verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationExpiry(LocalDateTime.now().plusHours(24));
        user.setVerified(false);
        System.out.println("Token from request: " + token);

        userRepository.save(user);

        // send verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);
    }
    // #endregion

    // #region(Login)
    public AuthResponse<LoginResponse> login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getVerified()) {
            throw new RuntimeException("Account is not verified");
        }

        String token = jwtService.generateToken(user.getId());

        return new AuthResponse<>(
                200,
                "Login successful!",
                new LoginResponse(token));
    }

    // #endregion

    // #region (verify account)
    public String verifyAccount(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElse(null);

        if (user == null) {
            return "Invalid verification token";
        }
        if (user.getVerificationExpiry() == null || user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Link activation has expired. Please request a new activation link.");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        return "Account has been successfully activated! You can now log in.";
    }
    // #endregion

    // #region (forgot Password)
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return;
        }

        SecureRandom random = new SecureRandom();
        String pin = String.valueOf(100000 + random.nextInt(900000));

        user.setResetPasswordToken(passwordEncoder.encode(pin));
        user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        emailService.sendResetEmail(user.getEmail(), user.getFullName(), pin);
    }

    // #endregion

    // #region (Reset password)
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (user.getResetPasswordToken() == null ||
                !passwordEncoder.matches(request.getPin(), user.getResetPasswordToken())) {
            throw new RuntimeException("Verification code is incorrect or invalid");
        }

        if (user.getResetPasswordExpiry() == null ||
                user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired. Please request a new code.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);
    }
    // #endregion
}