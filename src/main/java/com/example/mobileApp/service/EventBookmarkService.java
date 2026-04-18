package com.example.mobileApp.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.TargetType;
import com.example.mobileApp.entity.EventBookmark;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.EventMapper;
import com.example.mobileApp.repository.EventBookmarkRepository;
import com.example.mobileApp.repository.EventRepository;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.entity.ActivityType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventBookmarkService {

    private final EventBookmarkRepository eventBookmarkRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;
    private final ActivityService activityService;

    @Transactional
    public void bookmarkEvent(Long userId, Long eventId) {
        if (eventBookmarkRepository.existsByUserIdAndEventId(userId, eventId)) {
            return;
        }

        User user = userRepository.findById(userId).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        EventBookmark bookmark = EventBookmark.builder()
                .user(user)
                .event(event)
                .build();

        eventBookmarkRepository.save(bookmark);

        // 📝 Record Activity (Resilient)
        try {
            activityService.recordActivity(
                userId,
                ActivityType.EVENT_JOINED,
                TargetType.EVENT,
                event.getId(),
                event.getTitle());
        } catch (Exception e) {
            // Non-blocking: we continue even if logging fails
        }
    }

    @Transactional
    public void removeBookmark(Long userId, Long eventId) {
        eventBookmarkRepository.deleteByUserIdAndEventId(userId, eventId);
    }

    public Page<EventResponse> getBookmarkedEvents(Long userId, int page, int size) {
        return eventBookmarkRepository.findByUserId(userId, PageRequest.of(page, size))
                .map(bookmark -> {
                    EventResponse resp = eventMapper.toResponse(bookmark.getEvent());
                    resp.setBookmarked(true);
                    return resp;
                });
    }

    public List<Long> getBookmarkedEventIds(Long userId) {
        return eventBookmarkRepository.findByUserId(userId)
                .stream()
                .map(b -> b.getEvent().getId())
                .toList();
    }
}
