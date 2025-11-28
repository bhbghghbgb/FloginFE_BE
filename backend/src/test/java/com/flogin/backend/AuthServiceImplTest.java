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
    public void testAuthenticate_ShouldNotCallRepositoryWhenUsernameValidationFails() {
        LoginRequest request = new LoginRequest("invalid@", rawPassword);

        authService.authenticate(request);

        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    public void testAuthenticate_ShouldNotCallPasswordEncoderWhenUserNotFound() {
        LoginRequest request = new LoginRequest(username, rawPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        authService.authenticate(request);

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    public void testAuthenticate_ShouldNotGenerateTokenWhenPasswordIncorrect() {
        LoginRequest request = new LoginRequest(username, rawPassword);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        authService.authenticate(request);

        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    public void testValidateUsername_ShouldAcceptValidCharacters() {
        String result = authService.validateUsername("valid_user-name.123");
        assertEquals("", result);
    }

    @Test
    public void testValidateUsername_EdgeCase_ExactlyThreeCharacters() {
        String result = authService.validateUsername("abc");
        assertEquals("", result);
    }

    @Test
    public void testValidateUsername_EdgeCase_ExactlyFiftyCharacters() {
        String username50 = "a".repeat(50);
        String result = authService.validateUsername(username50);
        assertEquals("", result);
    }

    @Test
    public void testValidateUsername_ShouldRejectSpecialCharacters() {
        String[] invalidUsernames = {"test!", "user#", "admin$", "root%"};
        for (String invalid : invalidUsernames) {
            String result = authService.validateUsername(invalid);
            assertEquals("Username contains invalid characters", result);
        }
    }

    @Test
    public void testValidatePassword_EdgeCase_ExactlySixCharacters() {
        String result = authService.validatePassword("Abc123");
        assertEquals("", result);
    }

    @Test
    public void testValidatePassword_EdgeCase_ExactlyOneHundredCharacters() {
        String password100 = "A" + "b".repeat(98) + "1";
        String result = authService.validatePassword(password100);
        assertEquals("", result);
    }

    @Test
    public void testValidatePassword_ShouldAcceptMultipleDigitsAndLetters() {
        String result = authService.validatePassword("Abc123Def456");
        assertEquals("", result);
    }

    @Test
    public void testAuthenticate_ShouldReturnNullTokenOnFailure() {
        LoginRequest request = new LoginRequest(username, rawPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        LoginResponse response = authService.authenticate(request);

        assertNull(response.getToken());
        assertNotNull(response.getMessage());
    }

    @Test
    public void testValidateUsername_ShouldRejectBlankWithSpaces() {
        String result = authService.validateUsername("   ");
        assertEquals("Username cannot be empty", result);
    }

    @Test
    public void testValidatePassword_ShouldRejectBlankWithSpaces() {
        String result = authService.validatePassword("   ");
        assertEquals("Password cannot be empty", result);
    }

    @Test
    public void testAuthenticate_ShouldFailWhenUsernameIsWhitespaceOnly() {
        LoginRequest request = new LoginRequest("   ", rawPassword);

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Username cannot be empty", response.getMessage());
    }

    @Test
    public void testAuthenticate_ShouldFailWhenPasswordIsWhitespaceOnly() {
        LoginRequest request = new LoginRequest(username, "   ");

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Password cannot be empty", response.getMessage());
    }

    @Test
    public void testValidateUsername_ShouldAcceptUnderscoreDotAndHyphen() {
        String result = authService.validateUsername("test_user.name-123");
        assertEquals("", result);
    }

    @Test
    public void testAuthenticate_ShouldValidateBeforeFetchingUser() {
        LoginRequest request = new LoginRequest("a", rawPassword);

        authService.authenticate(request);

        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    public void testValidatePassword_ShouldRejectBoundaryCase_FiveCharacters() {
        String result = authService.validatePassword("Abcd1");
        assertEquals("Password must be 6-100 characters", result);
    }

    @Test
    public void testValidatePassword_ShouldRejectBoundaryCase_OneHundredOneCharacters() {
        String password101 = "A" + "b".repeat(99) + "1";
        String result = authService.validatePassword(password101);
        assertEquals("Password must be 6-100 characters", result);
    }

    @Test
    public void testAuthenticate_ShouldReturnCorrectSuccessFlag() {
        LoginRequest request = new LoginRequest(username, rawPassword);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString())).thenReturn("mock-token");

        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
    }
}
