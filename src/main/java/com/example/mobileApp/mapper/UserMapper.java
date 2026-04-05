package com.example.mobileApp.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.UserDTO;
import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.entity.User;

@Component
public class UserMapper {
    public User toUser(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getConfirmPassword());
        if (request.getFullName() != null) {
            String[] parts = request.getFullName().split(" ", 2);
            user.setFirstName(parts[0]);
            if (parts.length > 1) user.setLastName(parts[1]);
        }
        return user;
    }

    public UserResponse toProfileResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getDateOfBirth(),
                user.getGender() != null ? user.getGender().name() : null,
                user.getTravelStyle() != null ? user.getTravelStyle().name() : null,
                user.getImageUrl(),
                user.getInterests() != null
                        ? user.getInterests().stream()
                                .map(i -> new UserResponse.Interest(i.getId(), i.getName())) 
                                .toList()
                        : List.of());
    }

    public UserDTO toUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getImageUrl(),
                user.getTravelStyle() != null ? user.getTravelStyle().name() : null,
                user.getInterests() != null
                        ? user.getInterests().stream()
                                .map(com.example.mobileApp.entity.Interest::getName)
                                .toList()
                        : List.of()
        );
    }
}
