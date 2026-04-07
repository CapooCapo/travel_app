package com.example.mobileApp.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String imageUrl;
    private String avatarUrl;
    private String travelStyle;
    private List<InterestDTO> interests;
    private int followerCount;
    private int followingCount;
    private boolean isFollowing;
    private String role;
    private boolean verified;

    @Data
    @Builder
    public static class InterestDTO {
        private Long id;
        private String name;
    }
}
