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

        @Query("""
                        SELECT a
                        FROM Attraction a
                        WHERE (:keyword IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        AND (:rating IS NULL OR a.ratingAverage >= :rating)
                        """)
        Page<Attraction> searchAttractions(
                        String keyword,
                        Double rating,
                        Pageable pageable);

        Page<Attraction> findAllByOrderByRatingAverageDesc(Pageable pageable);
}
