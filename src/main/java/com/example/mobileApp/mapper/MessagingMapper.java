package com.example.mobileApp.mapper;

import com.example.mobileApp.dto.messaging.ChatDTO;
import com.example.mobileApp.dto.messaging.MessageDTO;
import com.example.mobileApp.entity.ChatRoom;
import com.example.mobileApp.entity.ChatRoomMember;
import com.example.mobileApp.entity.ChatMessage;
import com.example.mobileApp.entity.User;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class MessagingMapper {

    public MessageDTO toMessageDTO(ChatMessage message) {
        if (message == null) return null;
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFullName());
        dto.setSenderAvatar(message.getSender().getAvatarUrl());
        dto.setChatRoomId(message.getChatRoom().getId());
        dto.setContent(message.getContent());
        dto.setType(message.getType());
        dto.setStatus(message.getStatus());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }

    public ChatDTO toChatDTO(ChatRoom chat) {
        if (chat == null) return null;
        ChatDTO dto = new ChatDTO();
        dto.setId(chat.getId());
        dto.setName(chat.getName());
        dto.setType(chat.getType());
        dto.setParticipants(chat.getMembers().stream()
                .map(this::toParticipantDTO)
                .collect(Collectors.toSet()));
        dto.setLastMessage(toMessageDTO(chat.getLastMessage()));
        dto.setPinnedMessage(toMessageDTO(chat.getPinnedMessage()));
        dto.setCreatedAt(chat.getCreatedAt());
        dto.setUpdatedAt(chat.getUpdatedAt());
        return dto;
    }

    public ChatDTO.ParticipantDTO toParticipantDTO(ChatRoomMember member) {
        if (member == null) return null;
        User user = member.getUser();
        ChatDTO.ParticipantDTO dto = new ChatDTO.ParticipantDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setRole(member.getRole().toString());
        dto.setUnreadCount(member.getUnreadCount());
        return dto;
    }
}
