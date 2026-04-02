package com.example.mobileApp.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.dto.response.PageResponse;
import com.example.mobileApp.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventController extends BaseController {

    private final EventService eventService;


    @GetMapping("/attraction/{attractionId}")
    public ApiResponse<PageResponse<EventResponse>> getEventsByAttraction(
            @PathVariable Long attractionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<EventResponse> result = eventService.getEventsByAttraction(attractionId, page, size);

        return ok(PageResponse.of(result), "Success");
    }
}