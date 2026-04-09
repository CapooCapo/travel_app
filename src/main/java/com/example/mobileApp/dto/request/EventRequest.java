package com.example.mobileApp.dto.request;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String description;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    private BigDecimal price;

    private Long locationId;
    
    // Detailed location info if creating a new location or using ad-hoc
    private Double latitude;
    private Double longitude;
    private String address;

    private List<String> images;
}
