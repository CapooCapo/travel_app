package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.entity.Event;

@Component
public class EventMapper {

    public EventResponse toResponse(Event e) {
        EventResponse r = new EventResponse();

        r.setId(e.getId());
        r.setName(e.getName());
        r.setDescription(e.getDescription());
        r.setEventDate(e.getEventDate());
        r.setAttractionId(e.getAttraction().getId());

        return r;
    }
}