package com.example.mobileApp.dto.response;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal price;
    private String status; // Lifecycle status (computed)
    private String adminStatus; // Admin moderation status
    private Long locationId;
    private String address;
    private String category;
    private Long createdBy;
    private List<String> images;
    private boolean isBookmarked;
    private Double latitude;
    private Double longitude;

    // Derived flags
    public boolean isFree() {
        return price == null || price.compareTo(BigDecimal.ZERO) <= 0;
    }
}