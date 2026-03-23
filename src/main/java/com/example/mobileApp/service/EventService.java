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

    public Page<EventResponse> getEventsByAttraction(
            Long attractionId,
            int page,
            int size) {

        return eventRepository
                .findByAttractionId(attractionId, PageRequest.of(page, size))
                .map(e -> {
                    EventResponse r = new EventResponse();
                    r.setId(e.getId());
                    r.setName(e.getName());
                    r.setDescription(e.getDescription());
                    r.setEventDate(e.getEventDate());
                    r.setAttractionId(e.getAttraction().getId());
                    return r;
                });
    }
}