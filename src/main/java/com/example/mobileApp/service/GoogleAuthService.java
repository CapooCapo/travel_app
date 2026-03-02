package com.example.mobileApp.service;

import java.util.Collections;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.AuthResponse;
import com.example.mobileApp.dto.response.LoginResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.google.web-client-id}")
    private String googleClientId;

    public AuthResponse<LoginResponse> loginWithGoogle(String idTokenString) {

        GoogleIdToken.Payload payload = verifyGoogleToken(idTokenString);

        String email = payload.getEmail();
        String googleId = payload.getSubject();

        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new RuntimeException("Google email is not verified");
        }

        String fullName = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(fullName);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setAvatarUrl(pictureUrl);
            user.setGoogleId(googleId);
            user.setProvider(User.AuthProvider.GOOGLE);
            user.setVerified(true);
            userRepository.save(user);

        } else {

            if (user.getProvider() == User.AuthProvider.LOCAL) {
                throw new RuntimeException(
                        "Email already registered with password. Please login normally.");
            }

            if (user.getGoogleId() != null &&
                    !user.getGoogleId().equals(googleId)) {
                throw new RuntimeException("Google account mismatch");
            }

            user.setFullName(fullName);
            user.setAvatarUrl(pictureUrl);
            user.setVerified(true);

            userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getId());

        LoginResponse loginResponse = new LoginResponse(token);
        return new AuthResponse<>(200, "Login successful!", loginResponse);
    }


    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {

        try {

            NetHttpTransport transport = new NetHttpTransport();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    transport,
                    com.google.api.client.json.jackson2.JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            return idToken.getPayload();

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed");
        }
    }
}

