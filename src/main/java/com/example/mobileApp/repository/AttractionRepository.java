package com.example.mobileApp.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Attraction;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {

    // ─────────────────────────────────────────────
    // Basic lookups
    // ─────────────────────────────────────────────

    boolean existsByName(String name);

    Optional<Attraction> findByName(String name);

    // ─────────────────────────────────────────────
    // Search — dùng bởi AttractionService.search()
    // ─────────────────────────────────────────────

    Page<Attraction> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Attraction> findByRatingAverageGreaterThanEqual(Double rating, Pageable pageable);

    // ─────────────────────────────────────────────
    // Popular — dùng bởi getPopularAttractions()
    // ─────────────────────────────────────────────

    Page<Attraction> findAllByOrderByRatingAverageDesc(Pageable pageable);

    // ─────────────────────────────────────────────
    // Interest filter — dùng bởi getAttractionsByInterest()
    // ─────────────────────────────────────────────

    @Query("""
            SELECT DISTINCT a FROM Attraction a
            JOIN a.interests i
            WHERE i.id IN :interestIds
            ORDER BY a.ratingAverage DESC
            """)
    Page<Attraction> findByInterests(@Param("interestIds") Set<Long> interestIds, Pageable pageable);

    // ─────────────────────────────────────────────
    // PostGIS — nearby (dùng bởi getNearbyAttractions() và getNearbyRaw())
    // Radius mặc định 10km được hardcode trong query
    // ─────────────────────────────────────────────

    @Query(value = """
            SELECT a.*
            FROM locations a  -- SỬA Ở ĐÂY (từ attractions thành locations)
            WHERE ST_DWithin(
                ST_MakePoint(a.longitude, a.latitude)::geography,
                ST_MakePoint(:lon, :lat)::geography,
                :radius
            )
            ORDER BY ST_Distance(
                ST_MakePoint(a.longitude, a.latitude)::geography,
                ST_MakePoint(:lon, :lat)::geography
            )
            """, countQuery = """
            SELECT COUNT(*) FROM locations a -- SỬA Ở ĐÂY
            WHERE ST_DWithin(
                ST_MakePoint(a.longitude, a.latitude)::geography,
                ST_MakePoint(:lon, :lat)::geography,
                :radius
            )
            """, nativeQuery = true)
    Page<Attraction> findNearby(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius,
            Pageable pageable);

    // ─────────────────────────────────────────────
    // PostGIS — distance tới 1 địa điểm cụ thể
    // ─────────────────────────────────────────────

    @Query(value = """
            SELECT ST_Distance(
                ST_MakePoint(a.longitude, a.latitude)::geography,
                ST_MakePoint(:lon, :lat)::geography
            )
            FROM locations a -- SỬA Ở ĐÂY
            WHERE a.id = :id
            """, nativeQuery = true)
    Double getDistanceMeters(
            @Param("id") Long id,
            @Param("lat") double lat,
            @Param("lon") double lon);
    // ─────────────────────────────────────────────
    // OsmService
    // ─────────────────────────────────────────────

    boolean existsByNameAndAddress(String name, String address);

    boolean existsByExternalIdAndSource(String externalId, String source);
}