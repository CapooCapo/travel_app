package com.example.mobileApp.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationToken(String token);

    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByResetPasswordToken(String token);

    void deleteByVerifiedFalseAndVerificationExpiryBefore(LocalDateTime now);

        @Query("""
        SELECT u FROM User u
        LEFT JOIN FETCH u.interests
        WHERE u.id = :id
    """)
    Optional<User> findByIdWithInterests(@Param("id") Long id);
}
