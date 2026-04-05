package com.example.mobileApp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSyncRequest {
    private String clerkId;
    private String email;
    private String firstName;
    private String lastName;
    private String imageUrl;
}
