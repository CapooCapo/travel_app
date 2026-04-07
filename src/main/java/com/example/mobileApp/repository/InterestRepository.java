package com.example.mobileApp.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Interest;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {

    List<Interest> findAllByIdIn(List<Long> ids);

    Optional<Interest> findByName(String name);

    @Query("""
            SELECT a FROM Location a
            JOIN a.interests i
            WHERE i.id IN :interestIds
            """)
    Page<Location> findRecommended(Set<Long> interestIds, Pageable pageable);
}
