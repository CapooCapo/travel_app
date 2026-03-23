package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.NotificationResponse;
import com.example.mobileApp.entity.Notification;
import com.example.mobileApp.mapper.NotificationMapper;
import com.example.mobileApp.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public List<NotificationResponse> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    public void markAsRead(Long notificationId) {

        Notification n = notificationRepository
                .findById(notificationId)
                .orElseThrow();

        n.setIsRead(true);
        notificationRepository.save(n);
    }
}