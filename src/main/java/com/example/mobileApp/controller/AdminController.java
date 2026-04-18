package com.example.mobileApp.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.UserDTO;
import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.DashboardStatsDTO;
import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.dto.response.PageResponse;
import com.example.mobileApp.dto.response.ReportDTO;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.Report;
import com.example.mobileApp.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController extends BaseController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ApiResponse<PageResponse<UserDTO>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<UserDTO> result = adminService.getAllUsers(page, size);
        return ok(PageResponse.of(result), "Users fetched");
    }

    @GetMapping("/events")
    public ApiResponse<PageResponse<EventResponse>> getEvents(
            @RequestParam(required = false) Event.EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EventResponse> result = adminService.getEventsByStatus(status != null ? status : Event.EventStatus.PENDING, page, size);
        return ok(PageResponse.of(result), "Events fetched");
    }

    @PostMapping("/events/{id}/approve")
    public ApiResponse<Void> approveEvent(@PathVariable Long id) {
        adminService.moderateEvent(id, true);
        return ok(null, "Event approved");
    }

    @PostMapping("/events/{id}/reject")
    public ApiResponse<Void> rejectEvent(@PathVariable Long id) {
        adminService.moderateEvent(id, false);
        return ok(null, "Event rejected");
    }

    @GetMapping("/reviews/flagged")
    public ApiResponse<PageResponse<ReportDTO>> getFlaggedReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReportDTO> result = adminService.getFlaggedReviews(page, size);
        return ok(PageResponse.of(result), "Flagged reviews fetched");
    }

    @PostMapping("/reviews/{reviewId}/moderate")
    public ApiResponse<Void> moderateReview(
            @PathVariable Long reviewId,
            @RequestParam Report.ReportStatus status) {
        adminService.moderateReview(reviewId, status);
        return ok(null, "Review moderation processed as " + status.name().toLowerCase());
    }

    @GetMapping("/reports")
    public ApiResponse<PageResponse<ReportDTO>> getReports(
            @RequestParam(required = false) Report.ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReportDTO> result = adminService.getReports(status != null ? status : Report.ReportStatus.PENDING, page, size);
        return ok(PageResponse.of(result), "Reports fetched");
    }

    @PutMapping("/reports/{id}/resolve")
    public ApiResponse<Void> resolveReport(
            @PathVariable Long id,
            @RequestParam Report.ReportStatus status) {
        adminService.resolveReport(id, status);
        return ok(null, "Report " + status.name().toLowerCase());
    }

    @GetMapping("/analytics")
    public ApiResponse<DashboardStatsDTO> getAnalytics() {
        return ok(adminService.getAnalytics(), "Analytics fetched");
    }
}
