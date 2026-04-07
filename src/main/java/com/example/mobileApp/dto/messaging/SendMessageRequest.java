package com.example.mobileApp.dto.messaging;

import com.example.mobileApp.entity.ChatMessage.MessageType;
import lombok.Data;

@Data
public class SendMessageRequest {
    private Long chatRoomId;
    // Actually, following consistency, let's rename it to chatRoomId in the DTO as well.
    // Wait, the frontend uses chatId. If I change it here, I MUST change it in the frontend.
    // Usually, it's better to keep the API contract stable if possible, but since we are refactoring...
    // Let's check the MessagingController to see how it's used.
    private String content;
    private MessageType type = MessageType.TEXT;
}
