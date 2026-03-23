package com.example.mobileApp.dto.response;

import lombok.Data;

@Data
public class ReviewResponse {

    private Long id;
    private int rating;
    private String content;
    private String imageUrl;

    private String userName;
}
