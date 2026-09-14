package com.avasar.jobtracker.controller;

import com.avasar.jobtracker.dto.ApplicationRequest;
import com.avasar.jobtracker.dto.ApplicationResponse;
import com.avasar.jobtracker.entity.User;
import com.avasar.jobtracker.repository.UserRepository;
import com.avasar.jobtracker.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.avasar.jobtracker.dto.StatusUpdateRequest;
import com.avasar.jobtracker.entity.Role;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public ApplicationController(
            ApplicationService applicationService,
            UserRepository userRepository
    ) {
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse apply(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        return applicationService.apply(
                request,
                user
        );
    }

    @GetMapping("/my")
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        return applicationService.getMyApplications(user);
    }

    @GetMapping("/{id}")
    public ApplicationResponse getApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        return applicationService.getApplicationById(
                id,
                user
        );
    }

    private User getCurrentUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }
    @PutMapping("/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

//        if (user.getRole() != Role.ADMIN) {
//            throw new ResponseStatusException(
//                    HttpStatus.FORBIDDEN,
//                    "Only admins can update application status"
//            );
//        }

        return applicationService.updateStatus(
                id,
                request.getStatus(),
                user
        );
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        applicationService.deleteApplication(
                id,
                user
        );
    }
}