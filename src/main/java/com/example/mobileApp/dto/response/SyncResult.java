package com.example.mobileApp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SyncResult {
    private UserProfileDTO user;
    private boolean isNew;
}
