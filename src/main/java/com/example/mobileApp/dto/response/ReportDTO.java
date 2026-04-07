package com.example.mobileApp.dto.response;

import java.time.LocalDateTime;

import com.example.mobileApp.entity.Report;

import lombok.Data;

@Data
public class ReportDTO {
    private Long id;
    private Long reporterId;
    private String reporterName;
    private Long reportedId;
    private Report.ReportedType reportedType;
    private String reason;
    private Report.ReportStatus status;
    private LocalDateTime createdAt;
}
