package com.avasar.jobtracker.controller;

import com.avasar.jobtracker.dto.JobRequest;
import com.avasar.jobtracker.dto.JobResponse;
import com.avasar.jobtracker.entity.User;
import com.avasar.jobtracker.repository.UserRepository;
import com.avasar.jobtracker.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(
            JobService jobService,
            UserRepository userRepository
    ) {
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<JobResponse> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/{id}")
    public JobResponse getJobById(
            @PathVariable Long id
    ) {
        return jobService.getJobById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication
    ) {

        User admin = getCurrentUser(authentication);

        return jobService.createJob(request, admin);
    }

    @PutMapping("/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request
    ) {

        return jobService.updateJob(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(
            @PathVariable Long id
    ) {

        jobService.deleteJob(id);
    }

    private User getCurrentUser(
            Authentication authentication
    ) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }
}