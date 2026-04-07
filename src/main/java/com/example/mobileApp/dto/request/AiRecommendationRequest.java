package com.example.mobileApp.dto.request;

import lombok.Data;

@Data
public class AiRecommendationRequest {
    private Double lat;
    private Double lng;
    private Long userId;
}
