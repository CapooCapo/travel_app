package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.TravelScheduleDTO;
import com.example.mobileApp.dto.request.CreateTravelScheduleRequest;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.TravelSchedule;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.TravelScheduleMapper;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.TravelScheduleRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TravelScheduleService {

    private final TravelScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final TravelScheduleMapper mapper;

    @Transactional
    public TravelScheduleDTO createSchedule(Long userId, CreateTravelScheduleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        TravelSchedule schedule = TravelSchedule.builder()
                .user(user)
                .location(location)
                .scheduledDate(request.getScheduledDate())
                .notes(request.getNotes())
                .build();

        scheduleRepository.save(schedule);
        return mapper.toDTO(schedule);
    }

    public List<TravelScheduleDTO> getUserSchedules(Long userId) {
        return scheduleRepository.findByUserIdOrderByScheduledDateAsc(userId)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional
    public TravelScheduleDTO updateSchedule(Long userId, Long scheduleId, CreateTravelScheduleRequest request) {
        TravelSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        if (!schedule.getUser().getId().equals(userId)) {
            throw new RuntimeException("No permission to update this schedule");
        }

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        schedule.setLocation(location);
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setNotes(request.getNotes());

        scheduleRepository.save(schedule);
        return mapper.toDTO(schedule);
    }

    @Transactional
    public void deleteSchedule(Long userId, Long scheduleId) {
        TravelSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        if (!schedule.getUser().getId().equals(userId)) {
            throw new RuntimeException("No permission to delete this schedule");
        }

        scheduleRepository.deleteByIdCustom(scheduleId);
    }
}
