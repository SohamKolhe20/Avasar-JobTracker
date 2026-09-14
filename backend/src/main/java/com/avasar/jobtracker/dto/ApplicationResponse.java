package com.avasar.jobtracker.dto;

import com.avasar.jobtracker.entity.ApplicationStatus;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String jobUrl;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public ApplicationResponse() {
    }

    public ApplicationResponse(
            Long id,
            Long jobId,
            String jobTitle,
            String company,
            String jobUrl,
            ApplicationStatus status,
            LocalDateTime appliedAt
    ) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.jobUrl = jobUrl;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}
