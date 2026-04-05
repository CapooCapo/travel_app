package com.example.mobileApp.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTravelScheduleRequest {

    @NotNull(message = "Location ID is required")
    private Long locationId;

    @NotNull(message = "Scheduled date is required")
    private LocalDate scheduledDate;

    private String notes;
}
