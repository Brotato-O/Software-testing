package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Câu 2.1.2: Backend Unit Tests - Login Service (5 điểm)
 * Unit tests with Mockito - không cần database thật
 */
@DisplayName("Login Service Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService();
        
        // Inject mock vào service bằng Reflection
        org.springframework.test.util.ReflectionTestUtils.setField(authService, "userRepository", userRepository);

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("Test123");
    }

    // ========================================
    // Test authenticate() - 3 điểm
    // ========================================

    @Test
    @DisplayName("TC1: Login thành công")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        
        // Mock repository trả về user
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
        assertEquals("Dang nhap thanh cong", response.getMessage());
        assertNotNull(response.getToken());
        assertTrue(response.getToken().startsWith("TOKEN_testuser_"));
        
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    @DisplayName("TC2: Username không tồn tại")
    void testLoginWithNonExistentUser() {
        LoginRequest request = new LoginRequest("wronguser", "Pass123");
        
        // Mock repository không tìm thấy user
        when(userRepository.findByUsername("wronguser")).thenReturn(Optional.empty());
        
        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Username không tồn tại", response.getMessage());
        assertNull(response.getToken());
        
        verify(userRepository, times(1)).findByUsername("wronguser");
    }

    @Test
    @DisplayName("TC3: Password sai")
    void testLoginWithWrongPassword() {
        LoginRequest request = new LoginRequest("testuser", "WrongPass123");
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Password không đúng", response.getMessage());
        assertNull(response.getToken());
    }

    @Test
    @DisplayName("TC4: Request null")
    void testAuthenticateWithNullRequest() {
        LoginResponse response = authService.authenticate(null);
        
        assertFalse(response.isSuccess());
        assertEquals("Request không được null", response.getMessage());
        assertNull(response.getToken());
        
        // Không gọi repository vì request đã null
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("TC5: Username rỗng")
    void testAuthenticateWithEmptyUsername() {
        LoginRequest request = new LoginRequest("", "Test123");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Username is required", response.getMessage());
        
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("TC6: Username quá ngắn")
    void testAuthenticateWithShortUsername() {
        LoginRequest request = new LoginRequest("ab", "Test123");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Username must be between 3 and 50 characters", response.getMessage());
    }

    @Test
    @DisplayName("TC7: Username có ký tự đặc biệt")
    void testAuthenticateWithInvalidUsername() {
        LoginRequest request = new LoginRequest("test@user", "Test123");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Username can only contain letters, numbers, dots, underscores, and hyphens", 
                response.getMessage());
    }

    @Test
    @DisplayName("TC8: Password rỗng")
    void testAuthenticateWithEmptyPassword() {
        LoginRequest request = new LoginRequest("testuser", "");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password is required", response.getMessage());
    }

    @Test
    @DisplayName("TC9: Password quá ngắn")
    void testAuthenticateWithShortPassword() {
        LoginRequest request = new LoginRequest("testuser", "Te1");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password must be between 6 and 100 characters", response.getMessage());
    }

    @Test
    @DisplayName("TC10: Password không có chữ")
    void testAuthenticateWithPasswordNoLetters() {
        LoginRequest request = new LoginRequest("testuser", "123456");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password must contain both letters and numbers", response.getMessage());
    }

    @Test
    @DisplayName("TC11: Password không có số")
    void testAuthenticateWithPasswordNoNumbers() {
        LoginRequest request = new LoginRequest("testuser", "TestPass");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password must contain both letters and numbers", response.getMessage());
    }

    @Test
    @DisplayName("TC12: Username null")
    void testAuthenticateWithNullUsername() {
        LoginRequest request = new LoginRequest(null, "Test123");
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Username is required", response.getMessage());
    }

    @Test
    @DisplayName("TC13: Password null")
    void testAuthenticateWithNullPassword() {
        LoginRequest request = new LoginRequest("testuser", null);
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password is required", response.getMessage());
    }

    // ========================================
    // Test validateUsername() - 1 điểm
    // ========================================

    @Test
    @DisplayName("validateUsername: Hợp lệ")
    void testValidateUsernameValid() {
        assertNull(authService.validateUsername("testuser"));
        assertNull(authService.validateUsername("test.user"));
        assertNull(authService.validateUsername("test_user"));
        assertNull(authService.validateUsername("test-user"));
        assertNull(authService.validateUsername("test123"));
    }

    @Test
    @DisplayName("validateUsername: Null")
    void testValidateUsernameNull() {
        assertEquals("Username is required", authService.validateUsername(null));
    }

    @Test
    @DisplayName("validateUsername: Empty")
    void testValidateUsernameEmpty() {
        assertEquals("Username is required", authService.validateUsername(""));
        assertEquals("Username is required", authService.validateUsername("   "));
    }

    @Test
    @DisplayName("validateUsername: Quá ngắn")
    void testValidateUsernameTooShort() {
        assertEquals("Username must be between 3 and 50 characters",
                authService.validateUsername("ab"));
        assertEquals("Username must be between 3 and 50 characters",
                authService.validateUsername("a"));
    }

    @Test
    @DisplayName("validateUsername: Quá dài")
    void testValidateUsernameTooLong() {
        assertEquals("Username must be between 3 and 50 characters",
                authService.validateUsername("a".repeat(51)));
    }

    @Test
    @DisplayName("validateUsername: Ký tự đặc biệt không hợp lệ")
    void testValidateUsernameInvalidChars() {
        assertEquals("Username can only contain letters, numbers, dots, underscores, and hyphens",
                authService.validateUsername("test@user"));
        assertEquals("Username can only contain letters, numbers, dots, underscores, and hyphens",
                authService.validateUsername("test user"));
        assertEquals("Username can only contain letters, numbers, dots, underscores, and hyphens",
                authService.validateUsername("test#user"));
    }

    // ========================================
    // Test validatePassword() - 1 điểm
    // ========================================

    @Test
    @DisplayName("validatePassword: Hợp lệ")
    void testValidatePasswordValid() {
        assertNull(authService.validatePassword("Test123"));
        assertNull(authService.validatePassword("Pass123456"));
        assertNull(authService.validatePassword("MyP4ssw0rd"));
    }

    @Test
    @DisplayName("validatePassword: Null")
    void testValidatePasswordNull() {
        assertEquals("Password is required", authService.validatePassword(null));
    }

    @Test
    @DisplayName("validatePassword: Empty")
    void testValidatePasswordEmpty() {
        assertEquals("Password is required", authService.validatePassword(""));
        assertEquals("Password is required", authService.validatePassword("   "));
    }

    @Test
    @DisplayName("validatePassword: Quá ngắn")
    void testValidatePasswordTooShort() {
        assertEquals("Password must be between 6 and 100 characters",
                authService.validatePassword("Te1"));
        assertEquals("Password must be between 6 and 100 characters",
                authService.validatePassword("Abc1"));
    }

    @Test
    @DisplayName("validatePassword: Quá dài")
    void testValidatePasswordTooLong() {
        assertEquals("Password must be between 6 and 100 characters",
                authService.validatePassword("Test1" + "a".repeat(96)));
    }

    @Test
    @DisplayName("validatePassword: Chỉ có số")
    void testValidatePasswordOnlyNumbers() {
        assertEquals("Password must contain both letters and numbers",
                authService.validatePassword("123456"));
        assertEquals("Password must contain both letters and numbers",
                authService.validatePassword("9876543210"));
    }

    @Test
    @DisplayName("validatePassword: Chỉ có chữ")
    void testValidatePasswordOnlyLetters() {
        assertEquals("Password must contain both letters and numbers",
                authService.validatePassword("TestPass"));
        assertEquals("Password must contain both letters and numbers",
                authService.validatePassword("abcdefgh"));
    }

    // ========================================
    // Test userExists()
    // ========================================

    @Test
    @DisplayName("userExists: User tồn tại")
    void testUserExistsTrue() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        
        assertTrue(authService.userExists("testuser"));
        
        verify(userRepository, times(1)).existsByUsername("testuser");
    }

    @Test
    @DisplayName("userExists: User không tồn tại")
    void testUserExistsFalse() {
        when(userRepository.existsByUsername("nonexistent")).thenReturn(false);
        
        assertFalse(authService.userExists("nonexistent"));
        
        verify(userRepository, times(1)).existsByUsername("nonexistent");
    }
}