package com.example.mobileApp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class DebugLoggingFilter extends OncePerRequestFilter {

    private static final List<String> DEBUG_PATHS = Arrays.asList(
            "/api/users/search",
            "/api/locations/ai-recommend"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        boolean isDebugPath = DEBUG_PATHS.stream().anyMatch(path::contains);

        if (!isDebugPath) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            logDebugInfo(requestWrapper, responseWrapper);
            responseWrapper.copyBodyToResponse();
        }
    }

    private void logDebugInfo(ContentCachingRequestWrapper request, ContentCachingResponseWrapper response) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String payload = new String(request.getContentAsByteArray(), StandardCharsets.UTF_8);
        String authHeader = request.getHeader("Authorization");

        log.info("🌐 [BE DEBUG] Incoming request: {}", path);
        log.info("   - Method: {}", method);
        log.info("   - Header [Authorization]: {}", authHeader != null ? "Present" : "Missing");
        log.info("   - Payload: {}", payload.isEmpty() ? "Empty" : payload);
        
        log.info("✅ [BE DEBUG] Response: {}", path);
        log.info("   - Status: {}", response.getStatus());
        // Note: For privacy/brevity, we only log status in this centralized filter 
        // unless deeper inspection is needed.
    }
}
