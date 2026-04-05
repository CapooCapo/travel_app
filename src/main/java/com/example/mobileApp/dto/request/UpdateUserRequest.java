package com.example.mobileApp.dto.request;

import java.time.LocalDate;
import java.util.Set;

import com.example.mobileApp.entity.User.Gender;
import com.example.mobileApp.entity.User.TravelStyle;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String imageUrl;
    private String travelStyle;
    private Set<Long> interestIds;
}
