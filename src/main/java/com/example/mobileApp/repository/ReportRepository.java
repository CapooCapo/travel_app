package com.example.mobileApp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mobileApp.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @EntityGraph(attributePaths = {"reporter"})
    Page<Report> findByStatus(Report.ReportStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"reporter"})
    Page<Report> findByReportedTypeAndStatus(Report.ReportedType reportedType, Report.ReportStatus status, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"reporter"})
    Page<Report> findAll(Pageable pageable);
}
