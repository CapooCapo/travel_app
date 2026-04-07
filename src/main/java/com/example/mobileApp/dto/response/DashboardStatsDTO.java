package com.example.mobileApp.dto.response;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long activeUsers; // Placeholder for now
    private long totalEvents;
    private long pendingEvents;
    private long totalReviews;
    private long totalReports;
    private long pendingReports;
    private Map<String, Long> topLocations; // Location name -> Event count
    private List<DailyActivityDTO> trafficStats;
    
    @Data
    @AllArgsConstructor
    public static class DailyActivityDTO {
        private String date;
        private long count;
    }
}
