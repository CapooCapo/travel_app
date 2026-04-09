package com.example.mobileApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDTO {
    private Long id;
    private Long locationId;
    private String name;
    private String description;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private String category;
}
