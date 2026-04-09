package com.example.mobileApp.service;

import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class DownloadTokenService {

    // Store token -> userId
    // In a production environment with multiple instances, use Redis instead.
    private final Map<String, TokenInfo> tokenMap = new ConcurrentHashMap<>();

    private static final long EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

    public String generateToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenMap.put(token, new TokenInfo(userId, System.currentTimeMillis() + EXPIRATION_MS));
        return token;
    }

    public Long consumeToken(String token) {
        TokenInfo info = tokenMap.get(token);
        if (info == null) return null;

        // Cleanup expired tokens on access
        if (System.currentTimeMillis() > info.expiry) {
            tokenMap.remove(token);
            return null;
        }

        tokenMap.remove(token); // Single use
        return info.userId;
    }

    private static class TokenInfo {
        final Long userId;
        final long expiry;

        TokenInfo(Long userId, long expiry) {
            this.userId = userId;
            this.expiry = expiry;
        }
    }
}
