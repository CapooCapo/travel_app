package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.ReviewResponse;
import com.example.mobileApp.entity.Review;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review r) {

        ReviewResponse res = new ReviewResponse();

        res.setId(r.getId());
        res.setRating(r.getRating());
        res.setContent(r.getContent());
        res.setImageUrl(r.getImageUrl());

        if (r.getUser() != null) {
            res.setUserName(r.getUser().getFullName());
        }

        return res;
    }
}