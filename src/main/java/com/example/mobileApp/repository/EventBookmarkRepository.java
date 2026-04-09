package com.example.mobileApp.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mobileApp.entity.EventBookmark;

public interface EventBookmarkRepository extends JpaRepository<EventBookmark, Long> {

    @EntityGraph(attributePaths = {"event", "event.location", "event.category"})
    Page<EventBookmark> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"event", "event.location", "event.category"})
    List<EventBookmark> findByUserId(Long userId);

    Optional<EventBookmark> findByUserIdAndEventId(Long userId, Long eventId);

    void deleteByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}
