package com.example.mobileApp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.ItineraryItem;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByItineraryIdAndDateOrderByStartTimeAscOrderIndexAsc(Long itineraryId, LocalDate date);
    
    List<ItineraryItem> findByItineraryIdOrderByDateAscStartTimeAscOrderIndexAsc(Long itineraryId);
}
