package com.example.mobileApp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mobileApp.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    @EntityGraph(attributePaths = {"location"})
    Page<Event> findByLocationId(Long locationId, Pageable pageable);

    @EntityGraph(attributePaths = {"location"})
    Page<Event> findByStatus(Event.EventStatus status, Pageable pageable);
}