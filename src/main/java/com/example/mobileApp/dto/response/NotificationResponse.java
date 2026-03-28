package com.example.mobileApp.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}