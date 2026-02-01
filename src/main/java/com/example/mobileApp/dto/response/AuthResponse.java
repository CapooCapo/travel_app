package com.example.mobileApp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor  
public class AuthResponse {
    private int status;
    private String token;
    private String message;
}