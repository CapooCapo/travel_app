package com.example.mobileApp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateLocationRequest {
    private String name;
    private String address;
    private String description;
    private Double latitude;
    private Double longitude;
    private String externalId;
    private String source;
    private String phone;
    private String website;
}
