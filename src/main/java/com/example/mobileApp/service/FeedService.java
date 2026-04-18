package com.example.mobileApp.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.response.ActivityResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.repository.ActivityRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ActivityResponse> getFeed(Long userId, int page, int size) {
        // 🏗️ Build Social Graph Network
        List<Long> networkIds = new java.util.ArrayList<>(userRepository.findFollowingIdsByUserId(userId));
        
        // 🤝 Always include self in network to see own impact/actions
        networkIds.add(userId);

        log.info("[FEED] Fetching social graph for userId: {} | Network Size: {} | IDs: {}", 
            userId, networkIds.size(), networkIds);

        return activityRepository.findBySocialNetwork(networkIds, PageRequest.of(page, size))
                .map(activity -> this.toResponse(activity, userId));
    }

    private ActivityResponse toResponse(com.example.mobileApp.entity.Activity activity, Long currentUserId) {
        User u = activity.getUser();
        
        String message = "performed an action";
        String targetType = "OTHER";
        String targetName = activity.getContent() != null ? activity.getContent() : "Unknown";

        switch (activity.getType()) {
            case REVIEW_CREATED -> {
                message = "reviewed";
                targetType = "LOCATION";
            }
            case EVENT_JOINED -> {
                message = "joined event";
                targetType = "EVENT";
            }
            case ITINERARY_CREATED -> {
                message = "created an itinerary";
                targetType = "EVENT";
            }
            case LOCATION_ADDED -> {
                message = "added to itinerary";
                targetType = "LOCATION";
            }
            case LOCATION_SHARED -> {
                message = "shared a location";
                targetType = "LOCATION";
            }
            case USER_FOLLOWED -> {
                message = "started following";
                targetType = "USER";
            }
            case LOCATION_RECOMMENDED -> {
                message = "recommended a place";
                targetType = "LOCATION";
            }
            default -> {
                targetType = activity.getTargetType() != null ? activity.getTargetType().name() : "OTHER";
            }
        }

        // 🤝 Populate follow status for the activity actor relative to current user
        boolean isFollowing = false;
        if (currentUserId != null && !currentUserId.equals(u.getId())) {
            isFollowing = userRepository.isFollowing(currentUserId, u.getId());
        }

        return ActivityResponse.builder()
                .id(activity.getId())
                .actorId(u.getId())
                .userName(u.getFullName())
                .userAvatar(u.getAvatarUrl())
                .type(activity.getType().name())
                .targetId(activity.getReferenceId())
                .targetName(targetName)
                .targetType(targetType)
                .content(activity.getContent())
                .message(message)
                .isFollowing(isFollowing)
                .createdAt(activity.getCreatedAt())
                .build();
    }
}
