package com.example.mobileApp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.mobileApp.entity.Event;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    @EntityGraph(attributePaths = {"location", "category"})
    Page<Event> findByLocationId(Long locationId, Pageable pageable);

    @EntityGraph(attributePaths = {"location", "category"})
    Page<Event> findByStatus(Event.EventStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"location", "category"})
    List<Event> findByCreatedBy_Id(Long userId);
}