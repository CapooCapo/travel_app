package com.example.mobileApp.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRequest {
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Pattern(
        regexp = "^[A-Za-zÀ-ỹ\\s]+$",
        message = "Full name must not contain numbers or special characters"
    )
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String travelStyle;
    private String avatarUrl;
    private List<Long> interestIds;
}
