package com.example.mobileApp.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.mobileApp.dto.response.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<AiRecommendationResponse> process(Set<String> interests, List<LocationResponse> nearby) {
        if (nearby == null || nearby.isEmpty()) return Collections.emptyList();

        String prompt = buildPrompt(interests, nearby);
        long startTime = System.currentTimeMillis();

        try {
            log.info("🤖 Calling Gemini API for ranking...");
            String response = callGemini(prompt);
            long duration = System.currentTimeMillis() - startTime;
            log.info("✅ Gemini API responded in {}ms", duration);

            String aiJson = extractText(response);

            if (aiJson == null || aiJson.isEmpty()) {
                log.warn("⚠️ Gemini returned empty or invalid text. Falling back to default ranking.");
                return fallback(nearby);
            }

            return map(aiJson, nearby);

        } catch (Exception e) {
            log.error("❌ Gemini ranking failed", e);
            return fallback(nearby);
        }
    }

    private String callGemini(String prompt) {

        Map<String, Object> body = Map.of(
            "contents", List.of(Map.of(
                "parts", List.of(Map.of("text", prompt))
            ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return restTemplate.postForObject(
            GEMINI_URL + apiKey,
            new HttpEntity<>(body, headers),
            String.class
        );
    }

    private String extractText(String response) throws Exception {
        JsonNode root = mapper.readTree(response);
        JsonNode candidates = root.path("candidates");
        if (candidates.isMissingNode() || !candidates.isArray() || candidates.isEmpty()) {
            log.error("❌ Gemini response missing candidates: {}", response);
            return null;
        }

        JsonNode parts = candidates.get(0).path("content").path("parts");
        if (!parts.isArray() || parts.isEmpty()) {
            log.error("❌ Gemini candidate missing parts: {}", response);
            return null;
        }

        String text = parts.get(0).path("text").asText();
        log.debug("📝 Gemini Raw Text: {}", text);

        int start = text.indexOf('[');
        int end = text.lastIndexOf(']');

        if (start != -1 && end != -1) {
            return text.substring(start, end + 1);
        }
        
        log.warn("⚠️ Could not find JSON array in Gemini response text.");
        return null;
    }

    private List<AiRecommendationResponse> map(String json, List<LocationResponse> nearby) {

        try {
            List<Map<String, Object>> list = mapper.readValue(json, List.class);

            return list.stream()
                .map(item -> {
                    Long id = Long.valueOf(item.get("id").toString());
                    String reason = item.get("reason").toString();

                    return nearby.stream()
                        .filter(a -> a.getId().equals(id))
                        .findFirst()
                        .map(a -> AiRecommendationResponse.builder()
                                .locationId(a.getId())
                                .name(a.getName())
                                .latitude(a.getLatitude())
                                .longitude(a.getLongitude())
                                .address(a.getAddress())
                                .category(a.getCategory())
                                .reason(reason)
                                .build())
                        .orElse(null);
                })
                .filter(Objects::nonNull)
                .toList();

        } catch (Exception e) {
            return fallback(nearby);
        }
    }

    private List<AiRecommendationResponse> fallback(List<LocationResponse> nearby) {

        return nearby.stream()
            .sorted(Comparator.comparing(
                a -> a.getRatingAverage() != null ? a.getRatingAverage() : 0.0,
                Comparator.reverseOrder()
            ))
            .limit(3)
            .map(a -> AiRecommendationResponse.builder()
                    .locationId(a.getId())
                    .name(a.getName())
                    .latitude(a.getLatitude())
                    .longitude(a.getLongitude())
                    .address(a.getAddress())
                    .category(a.getCategory())
                    .reason("Gợi ý phổ biến gần bạn")
                    .build())
            .toList();
    }

    private String buildPrompt(Set<String> interests, List<LocationResponse> nearby) {

        String interestStr = (interests == null || interests.isEmpty())
                ? "du lịch, ngắm cảnh"
                : String.join(", ", interests);

        String nearbyStr = nearby.stream()
            .map(n -> "- ID: %d | Name: %s | Rating: %.1f"
                .formatted(n.getId(), n.getName(),
                    n.getRatingAverage() != null ? n.getRatingAverage() : 0))
            .collect(Collectors.joining("\n"));

        return "User interests: " + interestStr + "\nNearby:\n" + nearbyStr;
    }
}