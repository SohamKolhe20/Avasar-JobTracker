package com.avasar.jobtracker.dto;

import java.time.LocalDateTime;

public class JobResponse {

    private Long id;
    private String title;
    private String company;
    private String location;
    private String description;
    private String requirements;
    private String jobUrl;
    private LocalDateTime postedAt;
    private String experienceLevel;

    public JobResponse() {
    }

    public JobResponse(
            Long id,
            String title,
            String company,
            String location,
            String experienceLevel,
            String description,
            String requirements,
            String jobUrl,
            LocalDateTime postedAt
    ) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.experienceLevel = experienceLevel;
        this.description = description;
        this.requirements = requirements;
        this.jobUrl = jobUrl;
        this.postedAt = postedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getLocation() {
        return location;
    }
    public String getExperienceLevel() {
        return experienceLevel;
    }

    public String getDescription() {
        return description;
    }

    public String getRequirements() {
        return requirements;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }
}