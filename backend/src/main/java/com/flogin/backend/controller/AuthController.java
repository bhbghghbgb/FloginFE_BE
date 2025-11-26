package com.flogin.backend.controller;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.service.auth.IAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.authenticate(request);
        if (loginResponse.isSuccess()) {
            log.debug("Someone logged in: " + request.getUsername() + " " + loginResponse.getToken());
            return ResponseEntity.ok(loginResponse);
        }
        log.debug("Someone failed to log in: " + request.getUsername());
        return new ResponseEntity<LoginResponse>(loginResponse, HttpStatus.UNAUTHORIZED);
    }
}
