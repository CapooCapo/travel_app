package com.example.mobileApp.dto.response;

import lombok.Data;

@Data
public class BookmarkResponse {

    private Long id;
    private Long locationId;
    private String locationName;
    private String imageUrl;

}
