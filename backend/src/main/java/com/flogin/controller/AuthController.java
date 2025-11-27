package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Gọi authenticate với LoginRequest object
        LoginResponse response = authService.authenticate(loginRequest);
        
        if (response.isSuccess()) {
            // Trả về thành công kèm token
            return ResponseEntity.ok(Map.of(
                "message", response.getMessage(),
                "token", response.getToken()
            ));
        } else {
            // Trả về lỗi 401 với message
            return ResponseEntity.status(401).body(Map.of(
                "message", response.getMessage()
            ));
        }
    }
}