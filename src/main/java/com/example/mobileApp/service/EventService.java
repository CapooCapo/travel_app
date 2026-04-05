package com.example.mobileApp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Page<EventResponse> getEventsByLocation(
            Long locationId,
            int page,
            int size) {

        return eventRepository
                .findByLocationId(locationId, PageRequest.of(page, size))
                .map(e -> {
                    EventResponse r = new EventResponse();
                    r.setId(e.getId());
                    r.setName(e.getName());
                    r.setDescription(e.getDescription());
                    r.setEventDate(e.getEventDate());
                    r.setLocationId(e.getLocation().getId());
                    return r;
                });
    }
}