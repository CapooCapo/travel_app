package com.example.mobileApp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.UserDTO;
import com.example.mobileApp.dto.response.DashboardStatsDTO;
import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.dto.response.ReportDTO;
import com.example.mobileApp.dto.response.ReviewResponse;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.Report;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.EventMapper;
import com.example.mobileApp.mapper.ReviewMapper;
import com.example.mobileApp.mapper.UserMapper;
import com.example.mobileApp.repository.EventRepository;
import com.example.mobileApp.repository.ReportRepository;
import com.example.mobileApp.repository.ReviewRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ReviewRepository reviewRepository;
    private final ReportRepository reportRepository;
    private final UserMapper userMapper;
    private final ReviewMapper reviewMapper;
    private final EventMapper eventMapper;

    public Page<UserDTO> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size))
                .map(userMapper::toUserDTO);
    }

    public Page<EventResponse> getEventsByStatus(Event.EventStatus status, int page, int size) {
        return eventRepository.findByStatus(status, PageRequest.of(page, size))
                .map(eventMapper::toResponse);
    }

    public Page<ReviewResponse> getAllReviews(int page, int size) {
        return reviewRepository.findAll(PageRequest.of(page, size))
                .map(reviewMapper::toResponse);
    }

    public Page<ReportDTO> getReports(Report.ReportStatus status, int page, int size) {
        return reportRepository.findByStatus(status, PageRequest.of(page, size))
                .map(this::toReportDTO);
    }

    public Page<ReportDTO> getFlaggedReviews(int page, int size) {
        return reportRepository.findByReportedTypeAndStatus(
                Report.ReportedType.REVIEW, 
                Report.ReportStatus.PENDING, 
                PageRequest.of(page, size))
                .map(this::toReportDTO);
    }

    @Transactional
    public void moderateEvent(Long id, boolean approve) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(approve ? Event.EventStatus.APPROVED : Event.EventStatus.REJECTED);
        eventRepository.save(event);
    }

    @Transactional
    public void resolveReport(Long id, Report.ReportStatus newStatus) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus(newStatus);
        reportRepository.save(report);
    }

    @Transactional
    public void moderateReview(Long reviewId, Report.ReportStatus action) {
        Page<Report> reports = reportRepository.findByReportedTypeAndStatus(
                Report.ReportedType.REVIEW, 
                Report.ReportStatus.PENDING, 
                PageRequest.of(0, 100));
        
        reports.stream()
                .filter(r -> r.getReportedId().equals(reviewId))
                .forEach(r -> {
                    r.setStatus(action);
                    reportRepository.save(r);
                });
        
        log.info("Review {} moderated with action: {}", reviewId, action);
    }

    public DashboardStatsDTO getAnalytics() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalEvents(eventRepository.count());
        stats.setPendingEvents(eventRepository.findByStatus(Event.EventStatus.PENDING, PageRequest.of(0, 1)).getTotalElements());
        stats.setTotalReviews(reviewRepository.count());
        stats.setTotalReports(reportRepository.count());
        stats.setPendingReports(reportRepository.findByStatus(Report.ReportStatus.PENDING, PageRequest.of(0, 1)).getTotalElements());
        
        return stats;
    }

    private ReportDTO toReportDTO(Report r) {
        try {
            ReportDTO dto = new ReportDTO();
            dto.setId(r.getId());
            dto.setReporterId(r.getReporter().getId());
            dto.setReporterName(r.getReporter().getFullName());
            dto.setReportedId(r.getReportedId());
            dto.setReportedType(r.getReportedType());
            dto.setReason(r.getReason());
            dto.setStatus(r.getStatus());
            dto.setCreatedAt(r.getCreatedAt());
            return dto;
        } catch (Exception ex) {
            log.error("❌ Error mapping report ID {}: {}", r.getId(), ex.getMessage(), ex);
            throw ex;
        }
    }
}
