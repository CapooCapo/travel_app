package com.example.mobileApp.controller;

import com.example.mobileApp.dto.messaging.ChatDTO;
import com.example.mobileApp.dto.messaging.CreateGroupChatRequest;
import com.example.mobileApp.dto.messaging.MessageDTO;
import com.example.mobileApp.dto.messaging.SendMessageRequest;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.service.MessagingService;
import com.example.mobileApp.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/messaging")
@RequiredArgsConstructor
@Slf4j
public class MessagingController extends BaseController {

    private final MessagingService messagingService;

    @GetMapping("/rooms")
    public ApiResponse<List<ChatDTO>> getChatRooms(@CurrentUser Long userId) {
        log.info("[BE DEBUG] Fetching chat rooms for user: {}", userId);
        return ok(messagingService.getChats(userId));
    }

    @GetMapping("/rooms/{id:[0-9]+}")
    public ApiResponse<ChatDTO> getChatRoomById(@PathVariable Long id) {
        log.info("[BE DEBUG] Fetching chat room by id: {}", id);
        return ok(messagingService.getChatById(id));
    }

    @PostMapping("/rooms")
    public ApiResponse<ChatDTO> createChatRoom(@CurrentUser Long userId, @RequestBody Long targetUserId) {
        log.info("[BE DEBUG] Creating private chat room between user {} and {}", userId, targetUserId);
        return ok(messagingService.createPrivateChat(userId, targetUserId));
    }

    @PostMapping("/rooms/group")
    public ApiResponse<ChatDTO> createGroupChat(@CurrentUser Long userId, @RequestBody CreateGroupChatRequest request) {
        log.info("[BE DEBUG] Creating group chat room : {}", request.getName());
        return ok(messagingService.createGroupChat(userId, request));
    }

    @GetMapping("/rooms/{chatRoomId:[0-9]+}/messages")
    public ApiResponse<List<MessageDTO>> getChatMessages(
            @PathVariable Long chatRoomId,
            @RequestParam(defaultValue = "1") int page) {
        log.info("[BE DEBUG] Fetching messages for chat room {}: page {}", chatRoomId, page);
        return ok(messagingService.getMessages(chatRoomId));
    }

    @PostMapping("/messages")
    public ApiResponse<MessageDTO> sendMessage(
            @CurrentUser Long userId,
            @RequestBody SendMessageRequest request) {
        log.info("[BE DEBUG] Sending message from user {} to chat {}: {}", userId, request.getChatRoomId(), request.getContent());
        return ok(messagingService.sendMessage(userId, request));
    }

    @PostMapping(value = "/messages/image", consumes = "multipart/form-data")
    public ApiResponse<MessageDTO> sendImageMessage(
            @CurrentUser Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("chatRoomId") Long chatRoomId) throws IOException {
        log.info("[BE DEBUG] Uploading image message from user {} to chat {}", userId, chatRoomId);
        return ok(messagingService.sendImageMessage(userId, chatRoomId, file));
    }

    @MessageMapping("/send")
    public void receiveMessage(SendMessageRequest request, @CurrentUser Long userId) {
        log.info("[BE DEBUG] Received WebSocket message from user {} for chat {}: {}", userId, request.getChatRoomId(), request.getContent());
        messagingService.sendMessage(userId, request);
    }
}
