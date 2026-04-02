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
    // Chứa toàn bộ thông tin địa điểm
    private AttractionResponse attraction; 
    
    // Lý do AI chọn địa điểm này (Ví dụ: "Phù hợp với sở thích leo núi của bạn")
    private String reason;
}