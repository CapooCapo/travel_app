package com.example.mobileApp.dto.request;

import java.time.LocalDate;

import com.example.mobileApp.entity.User.Gender;
import com.example.mobileApp.entity.User.TravelStyle;

import lombok.Data;

@Data
public class UpdateUserRequest {
     private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String avatarUrl;
    private TravelStyle travelStyle;
}
