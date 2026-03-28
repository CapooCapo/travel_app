package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.BookmarkResponse;
import com.example.mobileApp.entity.Bookmark;

@Component
public class BookmarkMapper {

    public BookmarkResponse toResponse(Bookmark b) {

        BookmarkResponse r = new BookmarkResponse();

        r.setId(b.getId());
        r.setAttractionId(b.getAttraction().getId());
        r.setAttractionName(b.getAttraction().getName());

        if (!b.getAttraction().getImages().isEmpty()) {
            r.setImageUrl(b.getAttraction().getImages().get(0).getImageUrl());
        }

        return r;
    }
}