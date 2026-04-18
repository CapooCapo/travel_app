package com.example.mobileApp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.entity.Activity;
import com.example.mobileApp.entity.ActivityType;
import com.example.mobileApp.entity.TargetType;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.repository.ActivityRepository;
import com.example.mobileApp.repository.UserRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordActivity(Long userId, ActivityType type, TargetType targetType, Long referenceId, String content) {
        try {
            // 🛡️ Idempotency check: Prevent duplicate logs for same User/Type/Action
            if (activityRepository.findByUserIdAndTypeAndReferenceId(userId, type, referenceId).isPresent()) {
                log.debug("Activity skip: Duplicate detected for user {} and {} with ref {}", userId, type, referenceId);
                return;
            }

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for activity logging: " + userId));

            Activity activity = Activity.builder()
                    .user(user)
                    .type(type)
                    .targetType(targetType)
                    .referenceId(referenceId)
                    .content(content)
                    .build();

            activityRepository.save(activity);
            
            // 🚀 Real-time Broadcast to Followers
            try {
                broadcastActivity(activity);
            } catch (Exception wsError) {
                log.error("[WS ERROR] Failed to broadcast activity via WebSocket: {}", wsError.getMessage());
            }
        } catch (Exception e) {
            log.warn("⚠️ [ACTIVITY LOGGING FAILED] Non-critical error: {}. Core transaction remains safe.", e.getMessage());
        }
    }

    private void broadcastActivity(Activity activity) {
        Long actorId = activity.getUser().getId();
        List<Long> followerIds = userRepository.findFollowerIdsByFollowingId(actorId);
        
        // Create a simple broadcast payload
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("type", "NEW_ACTIVITY");
        payload.put("actorId", actorId);
        payload.put("actorName", activity.getUser().getFullName());
        payload.put("activityType", activity.getType());
        payload.put("timestamp", activity.getCreatedAt());

        for (Long followerId : followerIds) {
            messagingTemplate.convertAndSendToUser(
                followerId.toString(),
                "/queue/activities",
                payload
            );
        }
    }
}
