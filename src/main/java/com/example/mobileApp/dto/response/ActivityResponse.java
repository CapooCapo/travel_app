package com.example.mobileApp.dto.response;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private Long id;
    private Long actorId;
    private String userName;
    private String userAvatar;
    private String type; // String to send lowercase simple types like 'review'
    private String message;
    private String targetName;
    private Long targetId;
    private String targetType;
    private String content;
    private LocalDateTime createdAt;
    private boolean isFollowing;
}
