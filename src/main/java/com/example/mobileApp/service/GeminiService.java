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

    public List<AiRecommendationResponse> process(Set<String> interests, List<AttractionResponse> nearby) {

        if (nearby == null || nearby.isEmpty()) return Collections.emptyList();

        String prompt = buildPrompt(interests, nearby);

        try {
            String response = callGemini(prompt);
            String aiJson = extractText(response);

            if (aiJson == null || aiJson.isEmpty()) {
                return fallback(nearby);
            }

            return map(aiJson, nearby);

        } catch (Exception e) {
            log.error("❌ Gemini error", e);
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
        JsonNode parts = root.path("candidates").get(0)
                .path("content").path("parts");

        if (!parts.isArray() || parts.isEmpty()) return null;

        String text = parts.get(0).path("text").asText();

        int start = text.indexOf('[');
        int end = text.lastIndexOf(']');

        return (start != -1 && end != -1) ? text.substring(start, end + 1) : null;
    }

    private List<AiRecommendationResponse> map(String json, List<AttractionResponse> nearby) {

        try {
            List<Map<String, Object>> list = mapper.readValue(json, List.class);

            return list.stream()
                .map(item -> {
                    Long id = Long.valueOf(item.get("id").toString());
                    String reason = item.get("reason").toString();

                    return nearby.stream()
                        .filter(a -> a.getId().equals(id))
                        .findFirst()
                        .map(a -> new AiRecommendationResponse(a, reason))
                        .orElse(null);
                })
                .filter(Objects::nonNull)
                .toList();

        } catch (Exception e) {
            return fallback(nearby);
        }
    }

    private List<AiRecommendationResponse> fallback(List<AttractionResponse> nearby) {

        return nearby.stream()
            .sorted(Comparator.comparing(
                a -> a.getRatingAverage() != null ? a.getRatingAverage() : 0.0,
                Comparator.reverseOrder()
            ))
            .limit(3)
            .map(a -> new AiRecommendationResponse(a, "Gợi ý phổ biến gần bạn"))
            .toList();
    }

    private String buildPrompt(Set<String> interests, List<AttractionResponse> nearby) {

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