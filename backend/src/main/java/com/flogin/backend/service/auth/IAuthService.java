package com.flogin.backend.service;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;

public interface IAuthService {
    String validateUsername(String username);
    String validatePassword(String password);
    LoginResponse authenticate(LoginRequest request);
}
