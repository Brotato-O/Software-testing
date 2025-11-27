package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @BeforeEach
    void setup() {
        reset(authService);
    }

    // ============================
    // 1) LOGIN SUCCESS — 200
    // ============================
    @Test
    @DisplayName("Login success → 200 OK")
    void testLoginSuccess() throws Exception {
        LoginResponse mock = new LoginResponse(true, "Success", "mock-token");
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mock);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"abc\",\"password\":\"123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mock-token"));

        verify(authService).authenticate(any(LoginRequest.class));
    }

    // ============================
    // 2) LOGIN VALIDATION ERROR → 400
    // ============================
    @Test
    @DisplayName("Login validation fail → 400 BAD REQUEST")
    void testLoginValidationFail() throws Exception {
        LoginResponse mock = new LoginResponse(false,
                "username is required", null);

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mock);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        verify(authService).authenticate(any(LoginRequest.class));
    }

    // ============================
    // 3) WRONG CREDENTIALS → 401
    // ============================
    @Test
    @DisplayName("Login wrong credentials → 401 Unauthorized")
    void testLoginUnauthorized() throws Exception {
        LoginResponse mock = new LoginResponse(false,
                "Invalid username or password", null);

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mock);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"abc\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        verify(authService).authenticate(any(LoginRequest.class));
    }
}
