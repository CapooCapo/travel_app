package com.example.mobileApp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRecommendationResponse {
    private Long locationId;
    private String name;
    private Double latitude;
    private Double longitude;
    private String reason;
    private String address;
    private String category;
}