package com.example.mobileApp.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class UserDataResponse {

    private UserResponse user;
    private List<ReviewResponse> reviews;
    private List<BookmarkResponse> bookmarks;

}
