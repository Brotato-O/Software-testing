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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest(AuthController.class)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private AuthService authService;

        @Test
        @DisplayName("POST /api/auth/login - Đăng nhập thành công")
        void testLoginSuccess() throws Exception {
                LoginRequest request = new LoginRequest("testuser", "Test123");
                LoginResponse mockResponse = new LoginResponse(true, "Dang nhap thanh cong", "TOKEN_12345678");

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(mockResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andDo(print())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
                                .andExpect(jsonPath("$.token").exists());
        }

        @Test
        @DisplayName("POST /api/auth/login - Sai password (401)")
        void testLoginWrongPassword() throws Exception {

                LoginRequest request = new LoginRequest("testuser", "Wrong123");

                LoginResponse failResponse = new LoginResponse(false, "Password không đúng", null);

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(failResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized())
                                .andDo(print())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.token").doesNotExist());
        }

        @Test
        @DisplayName("POST /api/auth/login - Sai username (401)")
        void testLoginWrongUsername() throws Exception {

                LoginRequest request = new LoginRequest("testuserWrong", "test123");

                LoginResponse failResponse = new LoginResponse(false, "Username không tồn tại", null);

                when(authService.authenticate(any(LoginRequest.class)))
                                .thenReturn(failResponse);

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized())
                                .andDo(print())
                                .andExpect(jsonPath("$.success").value(false))
                                .andExpect(jsonPath("$.token").doesNotExist());
        }

        // ============================================
        // Test 400 Bad Request - message contains "required"
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Validation error: username required")
        void testLoginValidationRequired() throws Exception {

                String invalidJson = """
                                {
                                    "username": "",
                                    "password": "Pass123"
                                }
                                """;

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(invalidJson))
                                .andExpect(status().isBadRequest())
                                .andDo(print())
                                .andExpect(jsonPath("$.errors.username").value("Username must be 3-50 characters"));
        }

        // ============================================
        // Test 400 Bad Request - message contains "must"
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Validation error: password must")
        void testLoginValidationMust() throws Exception {

                String invalidJson = """
                                {
                                    "username": "user123",
                                    "password": "abcdef"
                                }
                                """;

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(invalidJson))
                                .andDo(print())
                                .andExpect(status().isBadRequest())
                                .andDo(print())
                                .andExpect(jsonPath("$.errors.password")
                                                .value("Password must contain both letters and numbers"));
        }

        // ============================================
        // Test 400 Bad Request - message contains "only"
        // ============================================
        @Test
        @DisplayName("POST /api/auth/login - Validation error: username only")
        void testLoginValidationOnly() throws Exception {

                String invalidJson = """
                                {
                                    "username": "user@123",
                                    "password": "Pass123"
                                }
                                """;

                mockMvc.perform(
                                post("/api/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(invalidJson))
                                .andDo(print())
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.username").value(
                                                "Username can only contain letters, numbers, dots, hyphens, and underscores"));
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
                                .andDo(print())
                                .andExpect(header().exists("Access-Control-Allow-Origin"))
                                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
        }
}
