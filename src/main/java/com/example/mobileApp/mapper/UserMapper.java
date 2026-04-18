package com.example.mobileApp.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.UserDTO;
import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.dto.response.UserProfileDTO;
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
                user.getAvatarUrl(),
                user.getInterests() != null
                        ? user.getInterests().stream()
                                .map(i -> new UserResponse.Interest(i.getId(), i.getName())) 
                                .toList()
                        : List.of(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getVerified() != null ? user.getVerified() : false);
    }

    public UserProfileDTO toUserProfileDTO(User user, boolean isFollowing, long followerCount, long followingCount) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .imageUrl(user.getAvatarUrl())
                .avatarUrl(user.getAvatarUrl())
                .travelStyle(user.getTravelStyle() != null ? user.getTravelStyle().name() : null)
                .interests(user.getInterests() != null
                        ? user.getInterests().stream()
                                .map(i -> UserProfileDTO.InterestDTO.builder()
                                        .id(i.getId())
                                        .name(i.getName())
                                        .build())
                                .toList()
                        : List.of())
                .followersCount((int) followerCount)
                .followingCount((int) followingCount)
                .isFollowing(isFollowing)
                .role(user.getRole() != null ? user.getRole().name() : null)
                .verified(user.getVerified() != null ? user.getVerified() : false)
                .build();
    }

    public UserDTO toUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getTravelStyle() != null ? user.getTravelStyle().name() : null,
                user.getInterests() != null
                        ? user.getInterests().stream()
                                .map(com.example.mobileApp.entity.Interest::getName)
                                .toList()
                        : List.of(),
                user.getRole() != null ? user.getRole().name() : null
        );
    }
}
