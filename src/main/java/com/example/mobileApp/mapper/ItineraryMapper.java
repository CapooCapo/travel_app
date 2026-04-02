package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.ItineraryItemResponse;
import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.ItemType;
import com.example.mobileApp.entity.ItineraryItem;
import com.example.mobileApp.repository.AttractionRepository;
import com.example.mobileApp.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ItineraryMapper {

    private final AttractionRepository attractionRepository;
    private final EventRepository eventRepository;

    public ItineraryItemResponse toResponse(ItineraryItem item) {
        ItineraryItemResponse.ItineraryItemResponseBuilder builder = ItineraryItemResponse.builder()
                .id(item.getId())
                .type(item.getType())
                .referenceId(item.getReferenceId())
                .date(item.getDate())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .note(item.getNote())
                .orderIndex(item.getOrderIndex());

        // Resolve reference name and location to make it easy for the UI calendar display
        if (item.getType() == ItemType.PLACE) {
            Attraction attraction = attractionRepository.findById(item.getReferenceId()).orElse(null);
            if (attraction != null) {
                builder.name(attraction.getName())
                       .latitude(attraction.getLatitude())
                       .longitude(attraction.getLongitude())
                       .address(attraction.getAddress());
            } else {
                builder.name("Unknown Place");
            }
        } else if (item.getType() == ItemType.EVENT) {
            Event event = eventRepository.findById(item.getReferenceId()).orElse(null);
            if (event != null) {
                builder.name(event.getName());
                if (event.getAttraction() != null) {
                    builder.latitude(event.getAttraction().getLatitude())
                           .longitude(event.getAttraction().getLongitude())
                           .address(event.getAttraction().getAddress());
                }
            } else {
                builder.name("Unknown Event");
            }
        }

        return builder.build();
    }
}
