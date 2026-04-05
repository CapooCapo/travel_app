package com.example.mobileApp.dto;

import java.util.List;

public record UserDTO(
    Long id,
    String fullName,
    String email,
    String avatarUrl,
    String travelStyle,
    List<String> interests
) {}
