package com.example.mobileApp.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.mobileApp.entity.ItemType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddItineraryItemRequest {

    @NotNull(message = "Type is required")
    private ItemType type;

    @NotNull(message = "Reference ID is required")
    private Long referenceId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;
    private String note;

    private Boolean overrideConflict = false;
}