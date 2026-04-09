package com.example.mobileApp.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.ItineraryItemResponse;
import com.example.mobileApp.dto.response.ItineraryResponse;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.ItemType;
import com.example.mobileApp.entity.Itinerary;
import com.example.mobileApp.entity.ItineraryItem;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ItineraryMapper {

    private final LocationRepository locationRepository;
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

        if (item.getType() == ItemType.LOCATION) {
            Location location = locationRepository
                    .findById(item.getReferenceId())
                    .orElse(null);

            if (location != null) {
                builder.name(location.getName())
                        .latitude(location.getLatitude())
                        .longitude(location.getLongitude())
                        .address(location.getAddress());
            } else {
                builder.name("Unknown Place");
            }

        } else if (item.getType() == ItemType.EVENT) {
            Event event = eventRepository
                    .findById(item.getReferenceId())
                    .orElse(null);

            if (event != null) {
                builder.name(event.getTitle());

                if (event.getLocation() != null) {
                    builder.latitude(event.getLocation().getLatitude())
                            .longitude(event.getLocation().getLongitude())
                            .address(event.getLocation().getAddress());
                }
            } else {
                builder.name("Unknown Event");
            }
        }

        return builder.build();
    }

    public ItineraryResponse toResponse(
            Itinerary itinerary,
            Map<LocalDate, List<ItineraryItemResponse>> itemsByDate) {

        return ItineraryResponse.builder()
                .id(itinerary.getId())
                .title(itinerary.getTitle())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .publicFlag(itinerary.getPublicFlag())
                .notes(itinerary.getNotes())
                .itemsByDate(itemsByDate != null ? itemsByDate : Map.of())
                .build();
    }
}