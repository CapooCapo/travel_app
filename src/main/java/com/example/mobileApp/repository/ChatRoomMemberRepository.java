package com.example.mobileApp.repository;

import com.example.mobileApp.entity.ChatRoom;
import com.example.mobileApp.entity.ChatRoomMember;
import com.example.mobileApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    Optional<ChatRoomMember> findByChatRoomAndUser(ChatRoom chatRoom, User user);
    Optional<ChatRoomMember> findByChatRoomIdAndUserId(Long chatRoomId, Long userId);
}
