package com.flogin.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Clean up and create test user
        userRepository.deleteAll();

        testUser = User.builder()
            .username("testuser")
            .password(passwordEncoder.encode("password123"))
            .email("test@example.com")
            .active(true)
            .build();

        userRepository.save(testUser);
    }

    @Test
    void login_Success() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("testuser")
            .password("password123")
            .build();

        // When & Then
        ResultActions result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Login successfully"))
            .andExpect(jsonPath("$.token").exists());

        // Verify token is valid JWT
        String responseContent = result.andReturn().getResponse().getContentAsString();
        LoginResponse loginResponse = objectMapper.readValue(responseContent, LoginResponse.class);
        assertNotNull(loginResponse.getToken());
        assertTrue(loginResponse.getToken().split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void login_UserNotFound() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("nonexistent")
            .password("password123")
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk()) // Your service returns 200 with success=false
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("User not found"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    void login_WrongPassword() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("testuser")
            .password("wrongpassword1")
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Password is incorrect"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    void login_InvalidUsername_TooShort() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("ab") // Too short
            .password("password123")
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Username must be 3-50 characters"));
    }

    @Test
    void login_InvalidUsername_InvalidCharacters() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("user@name") // Invalid characters
            .password("password123")
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Username contains invalid characters"));
    }

    @Test
    void login_InvalidPassword_TooShort() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("testuser")
            .password("abc") // Too short
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Password must be 6-100 characters"));
    }

    @Test
    void login_InvalidPassword_NoNumbers() throws Exception {
        // Given
        LoginRequest loginRequest = LoginRequest.builder()
            .username("testuser")
            .password("password") // No numbers
            .build();

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Password must contain both letters and numbers"));
    }

    @Test
    void login_InactiveUser() throws Exception {
        // Given
        User inactiveUser = User.builder()
            .username("inactiveuser")
            .password(passwordEncoder.encode("password123"))
            .email("inactive@example.com")
            .active(false) // Inactive user
            .build();
        userRepository.save(inactiveUser);

        LoginRequest loginRequest = LoginRequest.builder()
            .username("inactiveuser")
            .password("password123")
            .build();

        // When & Then - This depends on your business logic
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk());
    }

    @Test
    void login_EmptyRequestBody() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void login_MalformedJSON() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ invalid json }"))
            .andExpect(status().isBadRequest());
    }
}