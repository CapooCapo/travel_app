package com.example.mobileApp.dto.messaging;

import lombok.Data;
import java.util.List;

/**
 * Request DTO for creating a group chat
 */
@Data
public class CreateGroupChatRequest {
    private String name;
    private List<Long> memberIds;
}
