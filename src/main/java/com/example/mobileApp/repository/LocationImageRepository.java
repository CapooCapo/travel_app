package com.example.mobileApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mobileApp.entity.LocationImage;

public interface LocationImageRepository
        extends JpaRepository<LocationImage, Long> {

    List<LocationImage> findByLocationId(Long locationId);
}
