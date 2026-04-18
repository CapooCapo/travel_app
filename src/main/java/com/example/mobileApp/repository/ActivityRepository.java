package com.example.mobileApp.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Activity;
import com.example.mobileApp.entity.ActivityType;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("SELECT a FROM Activity a WHERE a.user.id IN :networkIds OR (a.targetType = 'USER' AND a.referenceId IN :networkIds) ORDER BY a.createdAt DESC")
    Page<Activity> findBySocialNetwork(@Param("networkIds") List<Long> networkIds, Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.user.id IN :userIds ORDER BY a.createdAt DESC")
    Page<Activity> findByUserIdsIn(@Param("userIds") List<Long> userIds, Pageable pageable);

    Page<Activity> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT COUNT(DISTINCT a.user.id) FROM Activity a WHERE a.createdAt >= :threshold")
    long countActiveUsers(@Param("threshold") LocalDateTime threshold);

    Optional<Activity> findByUserIdAndTypeAndReferenceId(Long userId, ActivityType type, Long referenceId);
}
