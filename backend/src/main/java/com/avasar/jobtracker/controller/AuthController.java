package com.avasar.jobtracker.controller;

import com.avasar.jobtracker.dto.AuthResponse;
import com.avasar.jobtracker.dto.LoginRequest;
import com.avasar.jobtracker.dto.RegisterRequest;
import com.avasar.jobtracker.dto.UserResponse;
import com.avasar.jobtracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}
