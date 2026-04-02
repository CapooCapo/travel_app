package com.example.mobileApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Itinerary;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findAllByUserIdOrderByStartDateAsc(Long userId);
    Optional<Itinerary> findByIdAndUserId(Long id, Long userId);
}
