package com.example.mobileApp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String confirmPassword;
}
