package com.example.mobileApp.service;

import com.example.mobileApp.dto.messaging.ChatDTO;
import com.example.mobileApp.entity.ChatRoom;
import com.example.mobileApp.entity.ChatRoomMember;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.MessagingMapper;
import com.example.mobileApp.repository.ChatRoomMemberRepository;
import com.example.mobileApp.repository.ChatRoomRepository;
import com.example.mobileApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserRepository userRepository;
    private final MessagingMapper messagingMapper;

    @Transactional(readOnly = true)
    public List<ChatDTO> getChats(Long userId) {
        log.info("[BE DEBUG] Fetching chat rooms for user: {}", userId);
        return chatRoomRepository.findByUserId(userId).stream()
                .map(messagingMapper::toChatDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChatDTO getChatById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .map(messagingMapper::toChatDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Chat Room not found: " + chatRoomId));
    }

    @Transactional
    public ChatDTO createPrivateChat(Long creatorId, Long targetId) {
        return chatRoomRepository.findPrivateChatBetweenUsers(creatorId, targetId)
                .map(messagingMapper::toChatDTO)
                .orElseGet(() -> {
                    User creator = userRepository.findById(creatorId)
                            .orElseThrow(() -> new ResourceNotFoundException("Creator not found: " + creatorId));
                    User target = userRepository.findById(targetId)
                            .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetId));
                    
                    ChatRoom chatRoom = new ChatRoom();
                    chatRoom.setType(ChatRoom.ChatType.PRIVATE);
                    ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

                    ChatRoomMember member1 = new ChatRoomMember(savedRoom, creator, ChatRoomMember.MemberRole.ORGANIZER);
                    ChatRoomMember member2 = new ChatRoomMember(savedRoom, target, ChatRoomMember.MemberRole.MEMBER);
                    
                    chatRoomMemberRepository.save(member1);
                    chatRoomMemberRepository.save(member2);
                    
                    savedRoom.getMembers().add(member1);
                    savedRoom.getMembers().add(member2);

                    log.info("[BE DEBUG] Created private chat room {} between users {} and {}", savedRoom.getId(), creatorId, targetId);
                    return messagingMapper.toChatDTO(savedRoom);
                });
    }
}
