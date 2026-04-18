package com.example.mobileApp.service;

import com.example.mobileApp.dto.messaging.ChatDTO;
import com.example.mobileApp.dto.messaging.CreateGroupChatRequest;
import com.example.mobileApp.dto.messaging.MessageDTO;
import com.example.mobileApp.dto.messaging.SendMessageRequest;
import com.example.mobileApp.entity.ChatRoom;
import com.example.mobileApp.entity.ChatMessage;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.MessagingMapper;
import com.example.mobileApp.entity.ChatRoomMember;
import com.example.mobileApp.repository.ChatRoomRepository;
import com.example.mobileApp.repository.ChatMessageRepository;
import com.example.mobileApp.repository.ChatRoomMemberRepository;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.entity.ActivityType;
import com.example.mobileApp.entity.TargetType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessagingService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserRepository userRepository;
    private final MessagingMapper messagingMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityService activityService;

    @Transactional
    public List<ChatDTO> getChats(Long userId) {
        return chatRoomRepository.findByUserId(userId).stream()
                .map(messagingMapper::toChatDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatDTO getChatById(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat Room not found"));
        return messagingMapper.toChatDTO(chatRoom);
    }

    @Transactional
    public ChatDTO createPrivateChat(Long creatorId, Long targetId) {
        return chatRoomRepository.findPrivateChatBetweenUsers(creatorId, targetId)
                .map(messagingMapper::toChatDTO)
                .orElseGet(() -> {
                    User creator = userRepository.findById(creatorId).orElseThrow();
                    User target = userRepository.findById(targetId).orElseThrow();
                    
                    ChatRoom chatRoom = new ChatRoom();
                    chatRoom.setType(ChatRoom.ChatType.PRIVATE);
                    ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

                    ChatRoomMember member1 = new ChatRoomMember(savedRoom, creator, ChatRoomMember.MemberRole.ORGANIZER);
                    ChatRoomMember member2 = new ChatRoomMember(savedRoom, target, ChatRoomMember.MemberRole.MEMBER);
                    
                    chatRoomMemberRepository.save(member1);
                    chatRoomMemberRepository.save(member2);
                    
                    savedRoom.getMembers().add(member1);
                    savedRoom.getMembers().add(member2);

                    return messagingMapper.toChatDTO(savedRoom);
                });
    }

    @Transactional
    public ChatDTO createGroupChat(Long creatorId, CreateGroupChatRequest request) {
        if (request.getMemberIds() == null || request.getMemberIds().size() < 2) {
            throw new IllegalArgumentException("Group chat must have at least 2 members besides the creator");
        }

        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(request.getName());
        chatRoom.setType(ChatRoom.ChatType.GROUP);
        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

        // Add creator as ORGANIZER
        ChatRoomMember creatorMember = new ChatRoomMember(savedRoom, creator, ChatRoomMember.MemberRole.ORGANIZER);
        chatRoomMemberRepository.save(creatorMember);
        savedRoom.getMembers().add(creatorMember);

        // Add other members
        for (Long memberId : request.getMemberIds()) {
            if (memberId.equals(creatorId)) continue; // Skip if creator is also in memberIds
            User user = userRepository.findById(memberId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + memberId));
            ChatRoomMember member = new ChatRoomMember(savedRoom, user, ChatRoomMember.MemberRole.MEMBER);
            chatRoomMemberRepository.save(member);
            savedRoom.getMembers().add(member);
        }

        log.info("[BE DEBUG] Created group chat room {} with name {} and {} members", 
                savedRoom.getId(), savedRoom.getName(), savedRoom.getMembers().size());
        
        return messagingMapper.toChatDTO(savedRoom);
    }

    @Transactional
    public List<MessageDTO> getMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomIdOrderByCreatedAtAsc(chatRoomId).stream()
                .map(messagingMapper::toMessageDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDTO sendMessage(Long senderId, SendMessageRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setChatRoom(chatRoom);
        message.setContent(request.getContent());
        message.setType(request.getType());
        message.setStatus(ChatMessage.MessageStatus.SENT);

        // Map location fields (Resilient & Validated)
        if (message.getType() == ChatMessage.MessageType.LOCATION) {
            // 🛡️ Strict validation BEFORE any DB action or logging
            if (request.getLatitude() == null || request.getLongitude() == null) {
                log.error("[BAD REQUEST] Attempted to share location without coordinates: senderId={}, chatRoomId={}", senderId, request.getChatRoomId());
                throw new com.example.mobileApp.exception.ApiException(400, "Invalid location: Coordinates (latitude/longitude) are required.");
            }
            
            message.setLatitude(request.getLatitude());
            message.setLongitude(request.getLongitude());
            message.setPlaceName(request.getPlaceName());
            message.setLocationId(request.getLocationId());
            
            ChatMessage savedMessage = chatMessageRepository.save(message);

            // Record activity if it's a location message (Resilient)
            try {
                activityService.recordActivity(
                    senderId,
                    ActivityType.LOCATION_SHARED,
                    TargetType.LOCATION,
                    message.getLocationId(), 
                    message.getPlaceName() != null ? message.getPlaceName() : "Unknown Location"
                );
            } catch (Exception e) {
                log.error("[ACTIVITY ERROR] Failed to record LOCATION_SHARED activity for sender={}: {}", senderId, e.getMessage());
                // Non-blocking: we continue even if logging fails
            }
            
            chatRoom.setLastMessage(savedMessage);
            chatRoomRepository.save(chatRoom);
            MessageDTO dto = messagingMapper.toMessageDTO(savedMessage);
            broadcastMessage(chatRoom, dto);
            return dto;
        }

        ChatMessage savedMessage = chatMessageRepository.save(message);
        chatRoom.setLastMessage(savedMessage);
        chatRoomRepository.save(chatRoom);

        MessageDTO dto = messagingMapper.toMessageDTO(savedMessage);
        broadcastMessage(chatRoom, dto);

        return dto;
    }

    @Transactional
    public MessageDTO sendImageMessage(Long senderId, Long chatRoomId, MultipartFile file) throws IOException {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Save file
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/chat");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        String imageUrl = "/uploads/chat/" + fileName;

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setChatRoom(chatRoom);
        message.setContent(imageUrl);
        message.setType(ChatMessage.MessageType.IMAGE);
        message.setStatus(ChatMessage.MessageStatus.SENT);

        ChatMessage savedMessage = chatMessageRepository.save(message);
        chatRoom.setLastMessage(savedMessage);
        chatRoomRepository.save(chatRoom);

        MessageDTO dto = messagingMapper.toMessageDTO(savedMessage);
        broadcastMessage(chatRoom, dto);

        return dto;
    }

    private void broadcastMessage(ChatRoom chatRoom, MessageDTO dto) {
        // Broadcast to all members via WebSocket
        for (ChatRoomMember member : chatRoom.getMembers()) {
            User participant = member.getUser();
            log.info("[BE DEBUG] Broadcasting message to user {}: {}", participant.getId(), dto.getContent());
            messagingTemplate.convertAndSendToUser(
                    participant.getId().toString(),
                    "/queue/messages",
                    dto
            );
        }
    }

    @Transactional
    public void markAsSeen(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        message.setStatus(ChatMessage.MessageStatus.SEEN);
        chatMessageRepository.save(message);
        
        // Notify sender via WebSocket
        MessageDTO dto = messagingMapper.toMessageDTO(message);
        messagingTemplate.convertAndSendToUser(
                message.getSender().getId().toString(),
                "/queue/status",
                dto
        );
    }
}
