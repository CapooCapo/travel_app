package com.example.mobileApp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mobileApp.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByAttractionId(Long attractionId, Pageable pageable);
}