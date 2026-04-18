package com.example.mobileApp.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    boolean existsByName(String name);

    Optional<Location> findByName(String name);

    Page<Location> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Location> findByRatingAverageGreaterThanEqual(Double rating, Pageable pageable);

    Page<Location> findAllByOrderByRatingAverageDesc(Pageable pageable);

    @Query("""
            SELECT DISTINCT l FROM Location l
            JOIN l.interests i
            WHERE i.id IN :interestIds
            ORDER BY l.ratingAverage DESC
            """)
    Page<Location> findByInterests(@Param("interestIds") Set<Long> interestIds, Pageable pageable);

    @Query("""
            SELECT DISTINCT l FROM Location l
            JOIN l.interests i
            WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :interestName, '%'))
            """)
    Page<Location> findByInterestsName(@Param("interestName") String interestName, Pageable pageable);

    @Query(value = """
            WITH user_point AS (
                SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography as geom
            )
            SELECT l.*
            FROM locations l, user_point up
            WHERE ST_DWithin(l.geo, up.geom, :radius)
            ORDER BY ST_Distance(l.geo, up.geom)
            """, countQuery = """
            WITH user_point AS (
                SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography as geom
            )
            SELECT COUNT(*) 
            FROM locations l, user_point up
            WHERE ST_DWithin(l.geo, up.geom, :radius)
            """, nativeQuery = true)
    Page<Location> findNearby(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius,
            Pageable pageable);

    @Query(value = """
            WITH user_point AS (
                SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography as geom
            )
            SELECT l.*
            FROM locations l
            JOIN location_interests li ON l.id = li.location_id
            JOIN interests i ON li.interest_id = i.id
            , user_point up
            WHERE ST_DWithin(l.geo, up.geom, :radius)
              AND i.name IN :interestNames
            ORDER BY ST_Distance(l.geo, up.geom)
            """, nativeQuery = true)
    List<Location> findNearbyByInterests(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius,
            @Param("interestNames") Set<String> interestNames);

    @Query(value = """
            SELECT ST_Distance(
                l.geo,
                ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography
            )
            FROM locations l 
            WHERE l.id = :id
            """, nativeQuery = true)
    Double getDistanceMeters(
            @Param("id") Long id,
            @Param("lat") double lat,
            @Param("lon") double lon);

    boolean existsByNameAndAddress(String name, String address);

    boolean existsByExternalIdAndSource(String externalId, String source);

    Optional<Location> findByExternalIdAndSource(String externalId, String source);
}
