package com.example.mobileApp.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CalendarEventDTO {
    private Long id;
    private String type; // ITINERARY_ITEM or SCHEDULE
    private String title;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String locationName;
    private String notes;
}
