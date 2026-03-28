package com.example.mobileApp.dto.response;

import lombok.Data;

@Data
public class BookmarkResponse {

    private Long id;
    private Long attractionId;
    private String attractionName;
    private String imageUrl;

}
