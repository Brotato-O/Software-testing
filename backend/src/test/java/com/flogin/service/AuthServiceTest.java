package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Câu 2.1.2: Backend Unit Tests - Login Service (5 điểm)
 */
@SpringBootTest
@DisplayName("Login Service Unit Tests")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @BeforeEach
    void setUp() {
        // Database có sẵn users: testuser, admin, john.doe
    }

    // ========================================
    // Test authenticate() - 3 điểm
    // ========================================

    @Test
    @DisplayName("TC1: Login thành công")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
        assertEquals("Dang nhap thanh cong", response.getMessage());
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC2: Username không tồn tại")
    void testLoginWithNonExistentUser() {
        LoginRequest request = new LoginRequest("wronguser", "Pass123");
        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Username không tồn tại", response.getMessage());
    }

    @Test
    @DisplayName("TC3: Password sai")
    void testLoginWithWrongPassword() {
        LoginRequest request = new LoginRequest("testuser", "WrongPass123");
        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Password không đúng", response.getMessage());
    }

    @Test
    @DisplayName("TC4: Request null")
    void testAuthenticateWithNullRequest() {
        LoginResponse response = authService.authenticate(null);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC5: Username rỗng")
    void testAuthenticateWithEmptyUsername() {
        LoginRequest request = new LoginRequest("", "Test123");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC6: Username quá ngắn")
    void testAuthenticateWithShortUsername() {
        LoginRequest request = new LoginRequest("ab", "Test123");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC7: Username có ký tự đặc biệt")
    void testAuthenticateWithInvalidUsername() {
        LoginRequest request = new LoginRequest("test@user", "Test123");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC8: Password rỗng")
    void testAuthenticateWithEmptyPassword() {
        LoginRequest request = new LoginRequest("testuser", "");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC9: Password quá ngắn")
    void testAuthenticateWithShortPassword() {
        LoginRequest request = new LoginRequest("testuser", "Te1");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC10: Password không có chữ")
    void testAuthenticateWithPasswordNoLetters() {
        LoginRequest request = new LoginRequest("testuser", "123456");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    @Test
    @DisplayName("TC11: Password không có số")
    void testAuthenticateWithPasswordNoNumbers() {
        LoginRequest request = new LoginRequest("testuser", "TestPass");
        LoginResponse response = authService.authenticate(request);
        assertFalse(response.isSuccess());
    }

    // ========================================
    // Test validateUsername() - 1 điểm
    // ========================================

    @Test
    @DisplayName("validateUsername: Hợp lệ")
    void testValidateUsernameValid() {
        assertNull(authService.validateUsername("testuser"));
    }

    @Test
    @DisplayName("validateUsername: Null/Empty")
    void testValidateUsernameNull() {
        assertEquals("Username is required", authService.validateUsername(null));
        assertEquals("Username is required", authService.validateUsername(""));
    }

    @Test
    @DisplayName("validateUsername: Quá ngắn/dài")
    void testValidateUsernameLength() {
        assertEquals("Username must be between 3 and 50 characters",
                authService.validateUsername("ab"));
        assertEquals("Username must be between 3 and 50 characters",
                authService.validateUsername("a".repeat(51)));
    }

    @Test
    @DisplayName("validateUsername: Ký tự đặc biệt")
    void testValidateUsernameInvalidChars() {
        assertEquals("Username can only contain letters, numbers, dots, underscores, and hyphens",
                authService.validateUsername("test@user"));
    }

    // ========================================
    // Test validatePassword() - 1 điểm
    // ========================================

    @Test
    @DisplayName("validatePassword: Hợp lệ")
    void testValidatePasswordValid() {
        assertNull(authService.validatePassword("Test123"));
    }

    @Test
    @DisplayName("validatePassword: Null/Empty")
    void testValidatePasswordNull() {
        assertEquals("Password is required", authService.validatePassword(null));
        assertEquals("Password is required", authService.validatePassword(""));
    }

    @Test
    @DisplayName("validatePassword: Quá ngắn/dài")
    void testValidatePasswordLength() {
        assertEquals("Password must be between 6 and 100 characters",
                authService.validatePassword("Te1"));
        assertEquals("Password must be between 6 and 100 characters",
                authService.validatePassword("Test1" + "a".repeat(96)));
    }

    @Test
    @DisplayName("validatePassword: Thiếu chữ hoặc số")
    void testValidatePasswordFormat() {
        assertEquals("Password must contain both letters and numbers",
                authService.validatePassword("123456"));
        assertEquals("Password must contain both letters and numbers",
                authService.validatePassword("TestPass"));
    }

    // ========================================
    // Test userExists()
    // ========================================

    @Test
    @DisplayName("userExists: Kiểm tra user tồn tại")
    void testUserExists() {
        assertTrue(authService.userExists("testuser"));
        assertTrue(authService.userExists("admin"));
        assertFalse(authService.userExists("nonexistent"));
    }
}