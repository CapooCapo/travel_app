package com.example.mobileApp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            log.debug("[WS AUTH] CONNECT frame received. Auth header: {}", authHeader != null ? "Present" : "Missing");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    Authentication authentication = jwtAuthenticationConverter.convert(jwt);
                    accessor.setUser(authentication);
                    log.debug("[WS AUTH] Successfully authenticated user: {}", jwt.getSubject());
                } catch (Exception e) {
                    log.error("[WS AUTH] JWT validation failed: {}", e.getMessage());
                    throw new RuntimeException("Unauthorized: " + e.getMessage());
                }
            } else {
                log.error("[WS AUTH] Missing or invalid Authorization header");
                throw new RuntimeException("Unauthorized: No token provided");
            }
        }

        return message;
    }
}
