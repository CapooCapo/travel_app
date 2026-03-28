package com.example.mobileApp.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttractionResponse {
    private Long id;
    private String name;
    private String address;
    private String description;
    private Double latitude;
    private Double longitude;
    private Double ratingAverage;
    private Integer reviewCount;
    private List<String> imageUrls;
    private List<String> category; // Ví dụ: ["Beach", "Restaurant"]
}