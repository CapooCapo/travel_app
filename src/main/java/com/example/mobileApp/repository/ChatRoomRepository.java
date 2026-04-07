package com.example.mobileApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.mobileApp.entity.ChatRoom;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    @Query("SELECT c FROM ChatRoom c JOIN c.members m WHERE m.user.id = :userId")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT c FROM ChatRoom c JOIN c.members m1 JOIN c.members m2 WHERE m1.user.id = :userId1 AND m2.user.id = :userId2 AND c.type = 'PRIVATE'")
    Optional<ChatRoom> findPrivateChatBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
