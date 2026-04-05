package com.example.mobileApp.controller;

import java.util.List;

import com.example.mobileApp.security.CurrentUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.CalendarEventDTO;
import com.example.mobileApp.service.CalendarService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CalendarController extends BaseController {

    private final CalendarService calendarService;

    @GetMapping
    public ApiResponse<List<CalendarEventDTO>> getCalendar(
            @CurrentUser Long userId) {

        return ok(calendarService.getUserCalendar(userId));
    }
}
