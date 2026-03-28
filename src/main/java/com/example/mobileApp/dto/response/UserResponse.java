package com.example.mobileApp.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private long id;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private String travelStyle;
    private String avatarUrl;
    private List<String> interests; 
}

