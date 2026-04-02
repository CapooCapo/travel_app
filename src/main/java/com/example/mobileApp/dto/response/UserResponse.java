package com.example.mobileApp.dto.response;

import java.time.LocalDate;
import java.util.List;


public record UserResponse(
    Long id,
    String fullName,
    String email,
    LocalDate dateOfBirth,
    String gender,
    String travelStyle,
    String avatarUrl,
    List<Interest> interests
) {
    public record Interest(Long id, String name) {}
}
