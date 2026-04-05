package com.example.mobileApp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.ItineraryItem;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {

    List<ItineraryItem> findByItineraryId(Long itineraryId);

    List<ItineraryItem> findByItineraryUserId(Long userId);

    List<ItineraryItem> findByItineraryIdAndDate(Long itineraryId, LocalDate date);

    @Query("""
        SELECT MAX(i.orderIndex)
        FROM ItineraryItem i
        WHERE i.itinerary.id = :itineraryId
        AND i.date = :date
    """)
    Optional<Integer> findMaxOrderIndex(Long itineraryId, LocalDate date);
}