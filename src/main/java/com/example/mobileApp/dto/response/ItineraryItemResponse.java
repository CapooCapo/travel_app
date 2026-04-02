package com.example.mobileApp.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.mobileApp.entity.ItemType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItineraryItemResponse {
    private Long id;
    private ItemType type;
    private Long referenceId;
    
    // Extracted details for UI display so frontend doesn't need N+1 calls
    private String name; 
    private Double latitude;
    private Double longitude;
    private String address;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String note;
    private Integer orderIndex;
}
