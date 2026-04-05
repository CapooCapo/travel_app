package com.example.mobileApp.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelScheduleDTO {
    private Long id;
    private Long locationId;
    private String locationName; // Helpful for the frontend
    private LocalDate scheduledDate;
    private String notes;
}
