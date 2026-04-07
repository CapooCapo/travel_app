package com.example.mobileApp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Request DTO for updating user avatar URL
 */
@Data
public class UpdateAvatarRequest {
    @NotBlank(message = "Avatar URL cannot be blank")
    @Pattern(regexp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]", message = "Invalid URL format")
    private String avatarUrl;
}
