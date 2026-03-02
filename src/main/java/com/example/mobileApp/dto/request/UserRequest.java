package com.example.mobileApp.dto.request;

import java.time.LocalDate;
import java.util.List;

public class UserRequest {
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String travelStyle;
    private String avatarUrl;
    private List<Long> interestIds;
}
