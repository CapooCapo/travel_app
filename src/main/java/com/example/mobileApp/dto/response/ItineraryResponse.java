package com.example.mobileApp.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItineraryResponse {

    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean publicFlag; 
    private String notes;
    private Map<LocalDate, List<ItineraryItemResponse>> itemsByDate;
}
