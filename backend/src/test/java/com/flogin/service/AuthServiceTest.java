package com.flogin.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Test
    void authenticate_WithValidCredentials_ReturnsTrue() {
        // Given
        String username = "admin";
        String password = "password";

        // When
        boolean result = authService.authenticate(username, password);

        // Then
        assertTrue(result);
    }

    @Test
    void authenticate_WithInvalidCredentials_ReturnsFalse() {
        // Given
        String username = "wrong";
        String password = "invalid";

        // When
        boolean result = authService.authenticate(username, password);

        // Then
        assertFalse(result);
    }
}