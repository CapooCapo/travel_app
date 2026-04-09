package com.example.mobileApp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class ClerkJwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        
        // Skip check for non-API or permitAll paths
        if (path.startsWith("/api/users/sync") || 
            path.startsWith("/api/users/actions/export-data") || 
            path.startsWith("/api/locations") || 
            path.startsWith("/api/location-images") || 
            path.startsWith("/api/events") ||
            path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Only enforce for /api/**
        if (path.startsWith("/api/")) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("[BE DEBUG] Missing or invalid Authorization header for path: {}", path);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"status\": \"error\", \"message\": \"Unauthorized: Missing or invalid token\"}");
                return;
            }
        }

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof JwtAuthenticationToken jwtAuth) {
                Jwt jwt = jwtAuth.getToken();
                log.debug("[BE DEBUG] JWT processed for user: {}", jwt.getSubject());
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("[BE DEBUG] Authentication filter error: {}", e.getMessage(), e);
            throw e;
        }
    }
}
