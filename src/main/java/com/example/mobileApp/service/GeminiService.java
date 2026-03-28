package com.example.mobileApp.service;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value; // Sửa import này
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.mobileApp.dto.response.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {
    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public List<AiRecommendationResponse> process(Set<String> interests, List<AttractionResponse> nearby) {
        if (nearby.isEmpty()) return Collections.emptyList();

        String prompt = String.format(
            "User likes: %s. Nearby places: %s. " +
            "Select top 3 places and give a short reason why. " +
            "Return ONLY a JSON array: [{\"id\": Long, \"reason\": \"String\"}]",
            interests.toString(),
            nearby.stream().map(n -> n.getId() + ":" + n.getName()).collect(Collectors.joining(", "))
        );

        try {
            // 1. Gọi Gemini API
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestBody = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));
            String response = restTemplate.postForObject(GEMINI_URL + apiKey, requestBody, String.class);

            // 2. Parse JSON response từ AI
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            String aiJson = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Làm sạch chuỗi JSON nếu AI trả về kèm markdown ```json
            aiJson = aiJson.replace("```json", "").replace("```", "").trim();
            
            List<Map<String, Object>> recommendations = mapper.readValue(aiJson, List.class);

            // 3. Map kết quả AI với dữ liệu Attraction gốc
            return recommendations.stream().map(rec -> {
                Long id = Long.valueOf(rec.get("id").toString());
                String reason = (String) rec.get("reason");
                
                AttractionResponse match = nearby.stream()
                    .filter(a -> a.getId().equals(id))
                    .findFirst().orElse(null);

                return new AiRecommendationResponse(match, reason);
            }).filter(res -> res.getAttraction() != null).collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}