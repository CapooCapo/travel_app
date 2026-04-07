package com.example.mobileApp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {

    private Long id;
    private Long locationId;
    private String locationName;
    private String imageUrl;

}
