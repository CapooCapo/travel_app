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

    @Query(value = "SELECT COUNT(*) FROM user_follows WHERE following_id = :userId", nativeQuery = true)
    long countFollowers(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(*) FROM user_follows WHERE follower_id = :userId", nativeQuery = true)
    long countFollowing(@Param("userId") Long userId);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM user_follows WHERE follower_id = :userId AND following_id = :targetId)", nativeQuery = true)
    boolean isFollowing(@Param("userId") Long userId, @Param("targetId") Long targetId);

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
    @Query(value = "SELECT following_id FROM user_follows WHERE follower_id = :userId", nativeQuery = true)
    List<Long> findFollowingIdsByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT follower_id FROM user_follows WHERE following_id = :userId", nativeQuery = true)
    List<Long> findFollowerIdsByFollowingId(@Param("userId") Long userId);
}
