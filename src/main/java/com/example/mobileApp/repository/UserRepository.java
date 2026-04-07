package com.example.mobileApp.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.dto.UserDTO;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"interests"})
    Optional<User> findWithInterestsById(Long id);

    @EntityGraph(attributePaths = {"interests"})
    Optional<User> findWithInterestsByEmail(String email);

    @EntityGraph(attributePaths = {"interests"})
    Optional<User> findWithInterestsByClerkId(String clerkId);

    Optional<User> findByClerkId(String clerkId);
    
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = {"interests"})
    List<User> findWithInterestsByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName,
            String lastName,
            String email);

    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName,
            String lastName,
            String email);

    @Query("""
                SELECT u FROM User u
                LEFT JOIN FETCH u.interests
                WHERE u.id = :id
            """)
    Optional<User> findByIdWithInterests(@Param("id") Long id);

    @Query("""
                SELECT new com.example.mobileApp.dto.UserDTO(
                    u.id,
                    CONCAT(u.firstName, ' ', u.lastName),
                    u.email,
                    u.avatarUrl,
                    u.travelStyle,
                    u.role
                )
                FROM User u
                WHERE (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')))
                AND u.id <> :currentUserId
            """)
    List<UserDTO> findSearchProjections(@Param("query") String query, @Param("currentUserId") Long currentUserId, org.springframework.data.domain.Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"interests"})
    org.springframework.data.domain.Page<User> findAll(org.springframework.data.domain.Pageable pageable);
}
