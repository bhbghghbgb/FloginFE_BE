package com.flogin.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.config.JwtAuthenticationFilter;
import com.flogin.backend.config.JwtUtil;
import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.service.auth.AuthServiceImpl;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthServiceImpl authService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("Mock: Controller với mocked AuthService - login thành công")
    void testLoginWithMockedService() throws Exception {

        LoginResponse mockResponse = new LoginResponse(
                true,
                "Success",
                "mock-token");

        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf())
                        .content("""
                        {
                            "username": "test",
                            "password": "Pass123"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.token").value("mock-token"));

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Login fail - user not found")
    void testUserNotFound() throws Exception {
        LoginResponse mockResponse = new LoginResponse(false, "User not found", null);
        when(authService.authenticate(any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf())
                        .content("""
                        {"username":"ghost","password":"Pass123"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User not found"));

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Login fail - wrong password")
    void testWrongPassword() throws Exception {
        LoginResponse mockResponse = new LoginResponse(false, "Password is incorrect", null);
        when(authService.authenticate(any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf())
                        .content("""
                        {"username":"testuser","password":"wrong123"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Password is incorrect"));

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Login fail - empty request body")
    void testEmptyBody() throws Exception {
        LoginResponse mockResponse = new LoginResponse(false, "Username cannot be empty", null);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf())
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Username cannot be empty"));
        verify(authService, times(1)).authenticate(any(LoginRequest.class));    }

    @Test
    @DisplayName("Login fail - malformed JSON")
    void testMalformedJson() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf())
                        .content("{ invalid json }"))
                .andExpect(status().isBadRequest());

        verify(authService, never()).authenticate(any());
    }

}