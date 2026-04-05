package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.TravelScheduleDTO;
import com.example.mobileApp.entity.TravelSchedule;

@Component
public class TravelScheduleMapper {

    public TravelScheduleDTO toDTO(TravelSchedule entity) {
        if (entity == null) return null;

        return TravelScheduleDTO.builder()
                .id(entity.getId())
                .locationId(entity.getLocation().getId())
                .locationName(entity.getLocation().getName())
                .scheduledDate(entity.getScheduledDate())
                .notes(entity.getNotes())
                .build();
    }
}
