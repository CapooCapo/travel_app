package com.example.mobileApp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttractionDTO {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private String description;
    private List<String> images;
}
