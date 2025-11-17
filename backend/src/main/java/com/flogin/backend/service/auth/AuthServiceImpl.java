package com.flogin.backend.service.impl;

import com.flogin.backend.config.JwtUtil;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String validateUsername(String username) {
        if (username == null || username.isBlank()) {
            return "Username cannot be empty";
        }
        if (username.length() < 3 || username.length() > 50) {
            return "Username must be 3-50 characters";
        }
        if (!Pattern.matches("^[a-zA-Z0-9._-]+$", username)) {
            return "Username contains invalid characters";
        }
        return "";
    }

    @Override
    public String validatePassword(String password) {
        if (password == null || password.isBlank()) {
            return "Password cannot be empty";
        }
        if (password.length() < 6 || password.length() > 100) {
            return "Password must be 6-100 characters";
        }
        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            return "Password must contain both letters and numbers";
        }
        return "";
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        String usernameError = validateUsername(request.getUsername());
        if (!usernameError.isBlank()) {
            return new LoginResponse(false, usernameError, null);
        }

        String passwordError = validatePassword(request.getPassword());
        if (!passwordError.isBlank()) {
            return new LoginResponse(false, passwordError, null);
        }

        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            return new LoginResponse(false, "User not found", null);
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(false, "Password is incorrect", null);
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(true, "Login successfully", token);
    }
}
