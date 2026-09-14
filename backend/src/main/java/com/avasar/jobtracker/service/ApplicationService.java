package com.avasar.jobtracker.service;

import com.avasar.jobtracker.dto.ApplicationRequest;
import com.avasar.jobtracker.dto.ApplicationResponse;
import com.avasar.jobtracker.entity.Application;
import com.avasar.jobtracker.entity.ApplicationStatus;
import com.avasar.jobtracker.entity.Job;
import com.avasar.jobtracker.entity.User;
import com.avasar.jobtracker.exception.BadRequestException;
import com.avasar.jobtracker.exception.ConflictException;
import com.avasar.jobtracker.exception.ResourceNotFoundException;
import com.avasar.jobtracker.repository.ApplicationRepository;
import com.avasar.jobtracker.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public ApplicationResponse apply(
            ApplicationRequest request,
            User user
    ) {

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found"));

        if (applicationRepository.existsByUserIdAndJobId(
                user.getId(),
                job.getId()
        )) {
            throw new ConflictException(
                    "You have already applied to this job"
            );
        }

        Application application = new Application();

        application.setUser(user);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());

        Application savedApplication =
                applicationRepository.save(application);

        return toResponse(savedApplication);
    }
    @Transactional
    public ApplicationResponse updateStatus(
            Long applicationId,
            ApplicationStatus newStatus,
            User user

    ) {
        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                ));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not allowed to update this application"
            );
        }

        application.setStatus(newStatus);

        Application updatedApplication =
                applicationRepository.save(application);

        return toResponse(updatedApplication);
    }
    @Transactional
    public void deleteApplication(
            Long applicationId,
            User user
    ) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException("You are not allowed to view this application"));

        if (!application.getUser().getId()
                .equals(user.getId())) {

            throw new BadRequestException("You are not allowed to view this application");
        }

        applicationRepository.delete(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(
            User user
    ) {

        return applicationRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(
            Long id,
            User user
    ) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not allowed to view this application"
                                ));

        if (!application.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to view this application"
            );
        }

        return toResponse(application);
    }

    private ApplicationResponse toResponse(
            Application application
    ) {

        Job job = application.getJob();

        return new ApplicationResponse(
                application.getId(),
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getJobUrl(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }
}
