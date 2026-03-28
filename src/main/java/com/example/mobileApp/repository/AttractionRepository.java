package com.example.mobileApp.repository;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Attraction;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {
        @Query("""
                        SELECT a FROM Attraction a
                        ORDER BY (
                        6371 * acos(
                        cos(radians(:lat)) *
                        cos(radians(a.latitude)) *
                        cos(radians(a.longitude) - radians(:lng)) +
                        sin(radians(:lat)) *
                        sin(radians(a.latitude))
                        )
                        )
                        """)
        Page<Attraction> findNearby(Double lat, Double lng, Pageable pageable);

        Page<Attraction> findByNameContainingIgnoreCase(
                        String keyword,
                        Pageable pageable);

        @Query("""
                        SELECT DISTINCT a FROM Attraction a
                        JOIN a.interests i
                        WHERE i.id IN :interestIds
                        """)
        Page<Attraction> findByInterests(Set<Long> interestIds, Pageable pageable);

        Page<Attraction> findAllByOrderByRatingAverageDesc(Pageable pageable);

        Page<Attraction> findByRatingAverageGreaterThanEqual(Double rating, Pageable pageable);

        boolean existsByName(String name);
}
