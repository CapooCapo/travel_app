package com.example.mobileApp.repository;

import com.example.mobileApp.entity.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {

    boolean existsByName(String name);

    /**
     * Returns attractions within {@code radiusMeters} of the given coordinates,
     * ordered by distance ascending (nearest first).
     */
    @Query(value = """
            SELECT a.*
            FROM attractions a
            WHERE ST_DWithin(
                ST_MakePoint(a.longitude, a.latitude)::geography,
                ST_MakePoint(:lon, :lat)::geography,
                :radiusMeters
            )
            ORDER BY ST_Distance(
                ST_MakePoint(a.longitude, a.latitude)::geography,
                ST_MakePoint(:lon, :lat)::geography
            )
            """, nativeQuery = true)
    List<Attraction> findNearby(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMeters") double radiusMeters
    );
}
