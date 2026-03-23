package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.entity.Attraction;

@Component
public class AttractionMapper {

    public AttractionResponse toResponse(Attraction a) {
        AttractionResponse r = new AttractionResponse();
        r.setId(a.getId());
        r.setName(a.getName());
        r.setAddress(a.getAddress());
        r.setLatitude(a.getLatitude());
        r.setLongitude(a.getLongitude());
        r.setRatingAverage(a.getRatingAverage());
        return r;
    }

    public AttractionResponse toDetailResponse(Attraction a) {
        AttractionResponse r = toResponse(a);
        r.setDescription(a.getDescription());
        return r;
    }
}