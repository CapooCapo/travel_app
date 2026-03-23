package com.example.mobileApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mobileApp.entity.Bookmark;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUserId(Long userId);

    boolean existsByUserIdAndAttractionId(Long userId, Long attractionId);

    void deleteByUserIdAndAttractionId(Long userId, Long attractionId);

    List<Bookmark> findAllByUserId(Long userId);

    void deleteByUserId(Long userId);
}