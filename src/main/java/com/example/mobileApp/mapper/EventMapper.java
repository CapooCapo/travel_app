package com.example.mobileApp.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.entity.Event;

@Component
public class EventMapper {

    public EventResponse toResponse(Event e) {
        if (e == null) return null;

        return EventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .startTime(e.getStartTime())
                .endTime(e.getEndTime())
                .price(e.getPrice())
                .adminStatus(e.getStatus().name())
                .status(calculateLifecycleStatus(e))
                .locationId(e.getLocation() != null ? e.getLocation().getId() : null)
                .address(e.getLocation() != null ? e.getLocation().getAddress() : null)
                .category(e.getCategory() != null ? e.getCategory().getName() : "General")
                .createdBy(e.getCreatedBy() != null ? e.getCreatedBy().getId() : null)
                .images(e.getImages() != null ? new ArrayList<>(e.getImages()) : new ArrayList<>())
                .latitude(e.getLocation() != null ? e.getLocation().getLatitude() : null)
                .longitude(e.getLocation() != null ? e.getLocation().getLongitude() : null)
                .build();
    }

    private String calculateLifecycleStatus(Event e) {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(e.getStartTime())) {
            return "INCOMING";
        } else if (now.isAfter(e.getEndTime())) {
            return "COMPLETED";
        } else {
            return "ONGOING";
        }
    }
}