package com.example.mobileApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mobileApp.entity.AttractionImage;

public interface AttractionImageRepository
        extends JpaRepository<AttractionImage, Long> {

    List<AttractionImage> findByAttractionId(Long attractionId);
}