package com.example.mobileApp.controller;

import org.springframework.web.bind.annotation.*;
import com.example.mobileApp.dto.response.ApiResponse;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/messaging")
public class MessagingController extends BaseController {

    @GetMapping("/chats")
    public ApiResponse<List<Object>> getChats() {
        return ok(Collections.emptyList(), "Chats fetched");
    }

    @GetMapping("/chats/{id}")
    public ApiResponse<Object> getChatById(@PathVariable Long id) {
        return ok(new Object(), "Chat fetched");
    }

    @PostMapping("/chats")
    public ApiResponse<Object> createChat(@RequestBody Object req) {
        return ok(req, "Chat created");
    }

    @GetMapping("/chats/{chatId}/messages")
    public ApiResponse<List<Object>> getMessages(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "1") int page) {
        return ok(Collections.emptyList(), "Messages fetched");
    }

    @PostMapping("/messages")
    public ApiResponse<Object> sendMessage(@RequestBody Object req) {
        return ok(req, "Message sent");
    }

    @PostMapping("/chats/{chatId}/messages/{messageId}/pin")
    public ApiResponse<Void> pinMessage(
            @PathVariable Long chatId,
            @PathVariable Long messageId) {
        return ok(null, "Message pinned");
    }
}
