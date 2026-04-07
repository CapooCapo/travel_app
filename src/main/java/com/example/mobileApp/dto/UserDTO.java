package com.example.mobileApp.dto;

import java.util.List;

public record UserDTO(
    Long id,
    String fullName,
    String email,
    String avatarUrl,
    String travelStyle,
    List<String> interests,
    String role
) {
    /**
     * Constructor for search projection which doesn't include interests.
     * Maps the TravelStyle enum to a String to avoid JPQL type mismatch.
     */
    public UserDTO(Long id, String fullName, String email, String avatarUrl, com.example.mobileApp.entity.User.TravelStyle travelStyle, com.example.mobileApp.entity.User.Role role) {
        this(id, fullName, email, avatarUrl, travelStyle != null ? travelStyle.name() : null, null, role != null ? role.name() : null);
    }
}
