package com.example.mobileApp.controller;

import java.util.List;

import com.example.mobileApp.security.CurrentUser;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.TravelScheduleDTO;
import com.example.mobileApp.dto.request.CreateTravelScheduleRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.service.TravelScheduleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class TravelScheduleController extends BaseController {

    private final TravelScheduleService scheduleService;

    @PostMapping
    public ApiResponse<TravelScheduleDTO> createSchedule(
            @CurrentUser Long userId,
            @Valid @RequestBody CreateTravelScheduleRequest request) {

        TravelScheduleDTO response = scheduleService.createSchedule(userId, request);
        return created(response, "Schedule created");
    }

    @GetMapping
    public ApiResponse<List<TravelScheduleDTO>> getUserSchedules(
            @CurrentUser Long userId) {

        return ok(scheduleService.getUserSchedules(userId));
    }

    @PutMapping("/{id}")
    public ApiResponse<TravelScheduleDTO> updateSchedule(
            @CurrentUser Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CreateTravelScheduleRequest request) {

        return ok(scheduleService.updateSchedule(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSchedule(
            @CurrentUser Long userId,
            @PathVariable Long id) {

        scheduleService.deleteSchedule(userId, id);
        return ok(null, "Schedule deleted");
    }
}
