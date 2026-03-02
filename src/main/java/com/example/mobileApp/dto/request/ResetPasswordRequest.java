package com.example.mobileApp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String pin;
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String newPassword;
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String confirmPassword;
}
