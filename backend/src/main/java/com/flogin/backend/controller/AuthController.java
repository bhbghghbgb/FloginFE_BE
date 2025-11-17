package com.flogin.backend.controller;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.service.auth.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.authenticate(request);
        return  ResponseEntity.ok(loginResponse);
    }
}
