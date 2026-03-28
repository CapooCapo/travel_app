package com.example.mobileApp.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CreateReviewRequest {

    @Min(1)
    @Max(5)
    private int rating;

    private String content;

    private String imageUrl;
}
