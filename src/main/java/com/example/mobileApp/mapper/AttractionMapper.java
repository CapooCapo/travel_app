package com.example.mobileApp.mapper;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.entity.Attraction;

@Component
public class AttractionMapper {

    public AttractionResponse toResponse(Attraction entity) {
        if (entity == null) return null;

        AttractionResponse response = new AttractionResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setAddress(entity.getAddress());
        response.setDescription(entity.getDescription());
        response.setLatitude(entity.getLatitude());
        response.setLongitude(entity.getLongitude());
        response.setRatingAverage(entity.getRatingAverage());

        // 1. Trích xuất danh sách URL ảnh
        if (entity.getImages() != null && !entity.getImages().isEmpty()) {
            response.setImageUrls(entity.getImages().stream()
                    .map(img -> img.getImageUrl())
                    .collect(Collectors.toList()));
        } else {
            response.setImageUrls(new ArrayList<>());
        }

        // 2. Lấy Interest đầu tiên làm Category, nếu không có thì để mặc định
        if (entity.getInterests() != null && !entity.getInterests().isEmpty()) {
            response.setCategory(entity.getInterests().iterator().next().getName());
        } else {
            response.setCategory("Attraction"); // Mặc định nếu DB chưa phân loại
        }

        return response;
    }

    public AttractionResponse toDetailResponse(Attraction entity) {
        return toResponse(entity);
    }
}