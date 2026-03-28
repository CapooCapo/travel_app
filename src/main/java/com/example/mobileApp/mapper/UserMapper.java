package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.entity.User;

@Component
public class UserMapper {
    public User toUser(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getConfirmPassword());
        user.setFullName(request.getFullName());
        return user;
    }

    public UserResponse profileResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getDateOfBirth(),
                user.getGender() != null ? user.getGender().name() : null,
                user.getTravelStyle() != null ? user.getTravelStyle().name() : null,
                user.getAvatarUrl(),
                user.getInterests()
                        .stream()
                        .map(i -> i.getName())
                        .toList());
    }
}
