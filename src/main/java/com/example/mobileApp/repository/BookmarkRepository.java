package com.example.mobileApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mobileApp.entity.Bookmark;
import com.example.mobileApp.dto.response.BookmarkResponse;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUserId(Long userId);

    boolean existsByUserIdAndLocationId(Long userId, Long locationId);

    void deleteByUserIdAndLocationId(Long userId, Long locationId);

    List<Bookmark> findAllByUserId(Long userId);

    void deleteByUserId(Long userId);

    @Query("""
                SELECT new com.example.mobileApp.dto.response.BookmarkResponse(
                    b.id,
                    l.id,
                    l.name,
                    (SELECT img.imageUrl FROM LocationImage img WHERE img.location.id = l.id ORDER BY img.id ASC LIMIT 1)
                )
                FROM Bookmark b
                JOIN b.location l
                WHERE b.user.id = :userId
            """)
    List<BookmarkResponse> findProjectionsByUserId(@Param("userId") Long userId);
}
