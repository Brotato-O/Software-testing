package com.flogin.controller;

import com.flogin.controller.AuthController;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private AuthService authService;

        // ============================================
        // 1️⃣ Test POST /api/auth/login thành công
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Đăng nhập thành công")
        void testLoginSuccess() throws Exception {
                LoginRequest request = new LoginRequest("testuser", "Test123"); // hợp lệ
                LoginResponse mockResponse = new LoginResponse(true, "Dang nhap thanh cong", "TOKEN_12345678");

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(mockResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
                                .andExpect(jsonPath("$.token").exists());
        }

        // ============================================
        // 2️⃣ Test POST /api/auth/login sai password
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Sai password (401)")
        void testLoginWrongPassword() throws Exception {
                // password hợp lệ với @Pattern nhưng không đúng
                LoginRequest request = new LoginRequest("testuser", "Wrong123");

                LoginResponse failResponse = new LoginResponse(false, "Password không đúng", null);

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(failResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.token").doesNotExist());
        }

        // ============================================
        // Test 400 Bad Request - message contains "required"
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Validation error (required)")
        void testLoginValidationRequired() throws Exception {
                LoginRequest request = new LoginRequest("user123", "Pass123"); // hợp lệ

                LoginResponse validationResponse = new LoginResponse(false,
                                "Username is required", null); // chứa "required"

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(validationResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value("Username is required"))
                                .andExpect(jsonPath("$.token").doesNotExist());
        }

        // ============================================
        // Test 400 Bad Request - message contains "must"
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Validation error (must)")
        void testLoginValidationMust() throws Exception {
                LoginRequest request = new LoginRequest("user123", "Pass123"); // hợp lệ

                LoginResponse validationResponse = new LoginResponse(false,
                                "Password must contain both letters and numbers", null); // chứa "must"

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(validationResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message")
                                                .value("Password must contain both letters and numbers"))
                                .andExpect(jsonPath("$.token").doesNotExist());
        }

        // ============================================
        // Test 400 Bad Request - message contains "only"
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Validation error (only)")
        void testLoginValidationOnly() throws Exception {
                LoginRequest request = new LoginRequest("user123", "Pass123"); // hợp lệ

                LoginResponse validationResponse = new LoginResponse(false,
                                "Username can only contain letters, numbers, dots, hyphens, and underscores", null); // chứa
                                                                                                                     // "only"

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(validationResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.message").value(
                                                "Username can only contain letters, numbers, dots, hyphens, and underscores"))
                                .andExpect(jsonPath("$.token").doesNotExist());
        }

        // ============================================
        // 3️⃣ Test CORS headers
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Kiểm tra CORS headers")
        void testCorsHeaders() throws Exception {
                LoginRequest request = new LoginRequest("testuser", "Test123");

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(new LoginResponse(true, "Dang nhap thanh cong", "TOKEN_123"));

                mockMvc.perform(
                                post("/api/auth/login")
                                                .header("Origin", "http://localhost:3000")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(header().exists("Access-Control-Allow-Origin"))
                                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
        }
}
