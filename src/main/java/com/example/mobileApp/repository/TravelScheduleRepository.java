package com.example.mobileApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.TravelSchedule;

@Repository
public interface TravelScheduleRepository extends JpaRepository<TravelSchedule, Long> {

    List<TravelSchedule> findByUserIdOrderByScheduledDateAsc(Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}
