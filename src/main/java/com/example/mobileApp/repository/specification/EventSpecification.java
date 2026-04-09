package com.example.mobileApp.repository.specification;

import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.Location;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class EventSpecification {

    public static Specification<Event> filter(
            String keyword,
            String category,
            Boolean isFree,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String lifecycleStatus,
            Event.EventStatus adminStatus,
            Double lat,
            Double lng,
            Double radius) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Admin Status (Only show APPROVED to public)
            if (adminStatus != null) {
                predicates.add(cb.equal(root.get("status"), adminStatus));
            }

            // Keyword
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"));
            }

            // Category
            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category").get("name"), category));
            }

            // Price
            if (Boolean.TRUE.equals(isFree)) {
                predicates.add(cb.or(cb.isNull(root.get("price")), cb.equal(root.get("price"), BigDecimal.ZERO)));
            } else {
                if (minPrice != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
                }
            }

            // Dates
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startTime"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endTime"), endDate));
            }

            // Lifecycle Status (Derived from time)
            LocalDateTime now = LocalDateTime.now();
            if ("INCOMING".equalsIgnoreCase(lifecycleStatus)) {
                predicates.add(cb.greaterThan(root.get("startTime"), now));
            } else if ("ONGOING".equalsIgnoreCase(lifecycleStatus)) {
                predicates.add(cb.and(cb.lessThanOrEqualTo(root.get("startTime"), now), cb.greaterThanOrEqualTo(root.get("endTime"), now)));
            } else if ("COMPLETED".equalsIgnoreCase(lifecycleStatus)) {
                predicates.add(cb.lessThan(root.get("endTime"), now));
            }

            // Proximity (Basic square approximation for performance, or use spatial if available)
            if (lat != null && lng != null && radius != null) {
                double radiusDegree = radius / 111.0; // Approximation: 1 degree approx 111km
                Join<Event, Location> locationJoin = root.join("location");
                predicates.add(cb.between(locationJoin.get("latitude"), lat - radiusDegree, lat + radiusDegree));
                predicates.add(cb.between(locationJoin.get("longitude"), lng - radiusDegree, lng + radiusDegree));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
