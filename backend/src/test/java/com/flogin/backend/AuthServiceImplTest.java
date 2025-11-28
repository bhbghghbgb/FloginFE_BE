package com.flogin.backend;

import com.flogin.backend.config.JwtUtil;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.service.auth.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    private final String username = "testuser";
    private final String rawPassword = "Test123";
    private final String encodedPassword = "Test123";
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private AuthServiceImpl authService;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    public void testAuthenticate_ShouldReturnIsSuccessTrueAndToken_WhenAuthenticateSuccess() {
        LoginRequest request = new LoginRequest(username, rawPassword);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString())).thenReturn("mock-token");

        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
        assertEquals("mock-token", response.getToken());
        assertEquals("Login successfully", response.getMessage());

        verify(userRepository, times(1)).findByUsername(request.getUsername());
        verify(jwtUtil, times(1)).generateToken(user.getUsername());
        verify(passwordEncoder, times(1)).matches(request.getPassword(), user.getPassword());
    }

    @Test
    public void testAuthenticate_ShouldReturnIsSuccessFalse_WhenUsernameNotFound() {
        LoginRequest request = new LoginRequest(username, rawPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertNull(response.getToken());
        assertEquals("User not found", response.getMessage());
    }

    @Test
    public void testAuthenticate_ShouldReturnIsSuccessFalse_WhenWrongPassword() {
        LoginRequest request = new LoginRequest(username, rawPassword);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertNull(response.getToken());
        assertEquals("Password is incorrect", response.getMessage());
    }

    @Test
    public void testAuthenticate_ShouldReturnIsSuccessFalse_WhenInvalidUsername() {
        LoginRequest request = new LoginRequest("u", rawPassword);

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertNull(response.getToken());
        assertEquals("Username must be 3-50 characters", response.getMessage());
    }

    @Test
    public void testAuthenticate_ShouldReturnIsSuccessFalse_WhenInvalidPassword() {
        LoginRequest request = new LoginRequest(username, "p");

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertNull(response.getToken());
        assertEquals("Password must be 6-100 characters", response.getMessage());
    }

    @Test
    public void testValidateUsername_ShouldReturnEmpty_WhenUsernameValid() {
        String result = authService.validateUsername(username);
        assertEquals("", result);
    }

    @Test
    public void testValidateUsername_ShouldReturnErrorMessage_WhenUsernameBlank() {
        String result = authService.validateUsername("");
        assertEquals("Username cannot be empty", result);
    }

    @Test
    public void testValidateUsername_ShouldReturnErrorMessage_WhenUsernameNull() {
        String result = authService.validateUsername(null);
        assertEquals("Username cannot be empty", result);
    }

    @Test
    public void testValidateUsername_ShouldReturnErrorMessage_WhenUsernameTooShort() {
        String result = authService.validateUsername("u");
        assertEquals("Username must be 3-50 characters", result);
    }

    @Test
    public void testValidateUsername_ShouldReturnErrorMessage_WhenUsernameTooLong() {
        String longUsername = "a".repeat(51);
        String result = authService.validateUsername(longUsername);
        assertEquals("Username must be 3-50 characters", result);
    }

    @Test
    public void testValidateUsername_ShouldReturnErrorMessage_WhenUsernameInValidCharacters() {
        String result = authService.validateUsername("test@");
        assertEquals("Username contains invalid characters", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnEmpty_WhenPasswordValid() {
        String result = authService.validatePassword(rawPassword);
        assertEquals("", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnErrorMessage_WhenPasswordBlank() {
        String result = authService.validatePassword("");
        assertEquals("Password cannot be empty", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnErrorMessage_WhenPasswordNull() {
        String result = authService.validatePassword(null);
        assertEquals("Password cannot be empty", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnErrorMessage_WhenPasswordTooShort() {
        String result = authService.validatePassword("u");
        assertEquals("Password must be 6-100 characters", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnErrorMessage_WhenPasswordTooLong() {
        String longPassword = "a".repeat(101);
        String result = authService.validatePassword(longPassword);
        assertEquals("Password must be 6-100 characters", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnErrorMessage_WhenPasswordMissingDigit() {
        String result = authService.validatePassword("password");
        assertEquals("Password must contain both letters and numbers", result);
    }

    @Test
    public void testValidatePassword_ShouldReturnErrorMessage_WhenPasswordMissingLetter() {
        String result = authService.validatePassword("123456");
        assertEquals("Password must contain both letters and numbers", result);
    }
      @Test
    public void testValidateUsername_ShouldRejectSpaces() {
        String result = authService.validateUsername("test user");
        assertEquals("Username contains invalid characters", result);
    }

    @Test
    public void testValidateUsername_ShouldAcceptDotDashUnderscore() {
        String result = authService.validateUsername("test.user-name_123");
        assertEquals("", result);
    }

    @Test
    public void testValidateUsername_BlankWithSpaces_IsTreatedAsEmpty() {
        String result = authService.validateUsername("   ");
        assertEquals("Username cannot be empty", result);
    }

    @Test
    public void testValidatePassword_MinLengthEdge() {
        String result = authService.validatePassword("Abc123");
        assertEquals("", result);
    }

    @Test
    public void testValidatePassword_MaxLengthEdge() {
        String longPassword = "A" + "b".repeat(98) + "1"; // length 100, has letter+digit
        String result = authService.validatePassword(longPassword);
        assertEquals("", result);
    }

    @Test
    public void testValidatePassword_AllowsSpecialCharactersIfContainsLetterAndDigit() {
        String result = authService.validatePassword("Pass@123");
        assertEquals("", result);
    }

    @Test
    public void testAuthenticate_ShouldNotCallRepoWhenUsernameInvalid() {
        LoginRequest request = new LoginRequest("ab", "Test123");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
        verify(userRepository, never()).findByUsername(anyString());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    public void testAuthenticate_ShouldNotGenerateToken_WhenPasswordInvalidLength() {
        LoginRequest request = new LoginRequest(username, "p");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Password must be 6-100 characters", response.getMessage());
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    public void testAuthenticate_WhenBothUsernameAndPasswordInvalid_ReturnsUsernameErrorFirst() {
        LoginRequest request = new LoginRequest("u", "p");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
        assertEquals("Username must be 3-50 characters", response.getMessage());
        verify(userRepository, never()).findByUsername(anyString());
    }
}
