package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.BookmarkResponse;
import com.example.mobileApp.entity.Bookmark;

@Component
public class BookmarkMapper {

    public BookmarkResponse toResponse(Bookmark b) {

        BookmarkResponse r = new BookmarkResponse();

        r.setId(b.getId());
        r.setLocationId(b.getLocation().getId());
        r.setLocationName(b.getLocation().getName());

        if (b.getLocation().getImages() != null && !b.getLocation().getImages().isEmpty()) {
            r.setImageUrl(b.getLocation().getImages().get(0).getImageUrl());
        }

        return r;
    }
}