package com.avasar.jobtracker.service;

import com.avasar.jobtracker.dto.JobRequest;
import com.avasar.jobtracker.dto.JobResponse;
import com.avasar.jobtracker.entity.Job;
import com.avasar.jobtracker.entity.User;
import com.avasar.jobtracker.exception.ResourceNotFoundException;
import com.avasar.jobtracker.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAllByOrderByPostedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found"));

        return toResponse(job);
    }

    public JobResponse createJob(JobRequest request, User admin) {

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setJobUrl(request.getJobUrl());

        job.setPostedBy(admin);
        job.setPostedAt(LocalDateTime.now());

        Job savedJob = jobRepository.save(job);

        return toResponse(savedJob);
    }

    public JobResponse updateJob(Long id, JobRequest request) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found"));

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setJobUrl(request.getJobUrl());

        Job updatedJob = jobRepository.save(job);

        return toResponse(updatedJob);
    }

    public void deleteJob(Long id) {

        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found");
        }

        jobRepository.deleteById(id);
    }

    private JobResponse toResponse(Job job) {

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getExperienceLevel(),
                job.getDescription(),
                job.getRequirements(),
                job.getJobUrl(),
                job.getPostedAt()
        );
    }
}