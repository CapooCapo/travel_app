package com.example.mobileApp.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;    
    private String pin;       
    private String newPassword;
}
