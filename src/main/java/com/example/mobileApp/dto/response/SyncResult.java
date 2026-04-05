package com.example.mobileApp.dto.response;

import com.example.mobileApp.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SyncResult {
    private User user;
    private boolean isNew;
}
