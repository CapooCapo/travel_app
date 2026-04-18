package com.example.mobileApp.dto.messaging;

import com.example.mobileApp.entity.ChatMessage.MessageStatus;
import com.example.mobileApp.entity.ChatMessage.MessageType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Long chatRoomId;
    private String content;
    private MessageType type;
    private MessageStatus status;
    private LocalDateTime createdAt;

    // Location fields
    private Double latitude;
    private Double longitude;
    private String placeName;
    private Long locationId;
}
