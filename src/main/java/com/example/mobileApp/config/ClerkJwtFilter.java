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

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication instanceof JwtAuthenticationToken jwtAuth) {
                Jwt jwt = jwtAuth.getToken();
                log.debug("[BE DEBUG] JWT processed: {}", jwt.getSubject());
                log.debug("===== CLERK JWT CLAIMS START =====");
                jwt.getClaims().forEach((key, value) -> log.debug("{}: {}", key, value));
                log.debug("===== CLERK JWT CLAIMS END =====");
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("[BE DEBUG] JWT failed: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\": 401, \"message\": \"Unauthorized: " + e.getMessage() + "\"}");
        }
    }
}
