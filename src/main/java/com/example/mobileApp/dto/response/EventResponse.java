package com.example.mobileApp.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EventResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime eventDate;
    private Long locationId;
}