package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceMockTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    // -------------------------
    // VALIDATION TESTS
    // -------------------------

    @Test
    void testValidateUsername_InvalidTooShort() {
        String result = authService.validateUsername("ab");
        assertEquals("Username must be between 3 and 50 characters", result);
    }

    @Test
    void testValidateUsername_InvalidCharacters() {
        String result = authService.validateUsername("abc@123");
        assertEquals("Username can only contain letters, numbers, dots, underscores, and hyphens", result);
    }

    @Test
    void testValidateUsername_Valid() {
        assertNull(authService.validateUsername("validUser_123"));
    }

    @Test
    void testValidatePassword_TooShort() {
        String result = authService.validatePassword("123");
        assertEquals("Password must be between 6 and 100 characters", result);
    }

    @Test
    void testValidatePassword_NoLetters() {
        String result = authService.validatePassword("1234567");
        assertEquals("Password must contain both letters and numbers", result);
    }

    @Test
    void testValidatePassword_Valid() {
        assertNull(authService.validatePassword("abc123"));
    }

    // -------------------------
    // AUTHENTICATE TESTS
    // -------------------------

    @Test
    void testAuthenticate_RequestNull() {
        LoginResponse response = authService.authenticate(null);
        assertFalse(response.isSuccess());
        assertEquals("Request không được null", response.getMessage());
    }

    @Test
    void testAuthenticate_UsernameNotExist() {
        LoginRequest req = new LoginRequest("user1", "Abc123");

        when(userRepository.findByUsername("user1")).thenReturn(Optional.empty());

        LoginResponse response = authService.authenticate(req);

        assertFalse(response.isSuccess());
        assertEquals("Username không tồn tại", response.getMessage());
    }

    @Test
    void testAuthenticate_WrongPassword() {
        LoginRequest req = new LoginRequest("user1", "Abc123");

        User dbUser = new User();
        dbUser.setUsername("user1");
        dbUser.setPassword("WrongPass");

        when(userRepository.findByUsername("user1"))
                .thenReturn(Optional.of(dbUser));

        LoginResponse response = authService.authenticate(req);

        assertFalse(response.isSuccess());
        assertEquals("Password không đúng", response.getMessage());
    }

    @Test
    void testAuthenticate_Success() {
        LoginRequest req = new LoginRequest("user1", "Abc123");

        User dbUser = new User();
        dbUser.setUsername("user1");
        dbUser.setPassword("Abc123");

        when(userRepository.findByUsername("user1"))
                .thenReturn(Optional.of(dbUser));

        LoginResponse response = authService.authenticate(req);

        assertTrue(response.isSuccess());
        assertEquals("Dang nhap thanh cong", response.getMessage());
        assertNotNull(response.getToken());
        assertTrue(response.getToken().startsWith("TOKEN_user1_"));
    }

    // -------------------------
    // USER EXISTS TEST
    // -------------------------

    @Test
    void testUserExists() {
        when(userRepository.existsByUsername("admin")).thenReturn(true);

        boolean exists = authService.userExists("admin");

        assertTrue(exists);
        verify(userRepository, times(1)).existsByUsername("admin");
    }
}
