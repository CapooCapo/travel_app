package com.example.mobileApp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.response.CalendarEventDTO;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.ItemType;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.EventRepository;
import com.example.mobileApp.repository.ItineraryItemRepository;
import com.example.mobileApp.repository.TravelScheduleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final ItineraryItemRepository itineraryItemRepository;
    private final TravelScheduleRepository travelScheduleRepository;
    private final LocationRepository locationRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getUserCalendar(Long userId) {
        List<CalendarEventDTO> events = new ArrayList<>();

        // 1. Get Itinerary Items
        itineraryItemRepository.findByItineraryUserId(userId).forEach(item -> {
            String title = "Unknown";
            String locationName = "";

            if (item.getType() == ItemType.LOCATION && item.getLocationId() != null) {
                Location location = locationRepository.findById(item.getLocationId()).orElse(null);
                if (location != null) {
                    title = location.getName();
                    locationName = location.getName();
                }
            } else if (item.getType() == ItemType.EVENT && item.getEventId() != null) {
                Event event = eventRepository.findById(item.getEventId()).orElse(null);
                if (event != null) {
                    title = event.getTitle();
                    if (event.getLocation() != null) {
                        locationName = event.getLocation().getName();
                    }
                }
            }

            events.add(CalendarEventDTO.builder()
                    .id(item.getId())
                    .type("ITINERARY_ITEM")
                    .title(title)
                    .date(item.getDate())
                    .startTime(item.getStartTime())
                    .endTime(item.getEndTime())
                    .locationName(locationName)
                    .notes(item.getNote())
                    .build());
        });

        // 2. Get Travel Schedules
        travelScheduleRepository.findByUserIdOrderByScheduledDateAsc(userId).forEach(schedule -> {
            events.add(CalendarEventDTO.builder()
                    .id(schedule.getId())
                    .type("SCHEDULE")
                    .title(schedule.getLocation().getName())
                    .date(schedule.getScheduledDate())
                    .locationName(schedule.getLocation().getName())
                    .notes(schedule.getNotes())
                    .build());
        });

        return events.stream()
                .sorted((a, b) -> {
                    int dateComp = a.getDate().compareTo(b.getDate());
                    if (dateComp != 0) return dateComp;
                    if (a.getStartTime() == null && b.getStartTime() == null) return 0;
                    if (a.getStartTime() == null) return 1;
                    if (b.getStartTime() == null) return -1;
                    return a.getStartTime().compareTo(b.getStartTime());
                })
                .collect(Collectors.toList());
    }
}
