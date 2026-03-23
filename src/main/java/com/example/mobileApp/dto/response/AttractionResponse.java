package com.example.mobileApp.dto.response;

import org.hibernate.validator.constraints.Length;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttractionResponse {
    private Long id;
    private String name;
    private String address;
    @Length(max = 2000)
    private String description;

    private Double latitude;
    private Double longitude;

    private Double ratingAverage;
}
