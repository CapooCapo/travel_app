package com.example.mobileApp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAttractionRequest {
    private String name;
    private String address;
    private String description;
    private Double latitude;
    private Double longitude;
}
