package com.example.mobileApp.dto.messaging;

import com.example.mobileApp.entity.ChatRoom.ChatType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ChatDTO {
    private Long id;
    private String name;
    private ChatType type;
    private Set<ParticipantDTO> participants;
    private MessageDTO lastMessage;
    private MessageDTO pinnedMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class ParticipantDTO {
        private Long id;
        private String fullName;
        private String avatarUrl;
        private String role;
        private Integer unreadCount;
    }
}
