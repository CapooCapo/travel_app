package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.NotificationResponse;
import com.example.mobileApp.entity.Notification;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification n) {

        NotificationResponse r = new NotificationResponse();

        r.setId(n.getId());
        r.setTitle(n.getTitle());
        r.setMessage(n.getMessage());
        r.setIsRead(n.getIsRead());
        r.setCreatedAt(n.getCreatedAt());

        return r;
    }
}