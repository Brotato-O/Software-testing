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
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest) {

        LoginResponse res = authService.authenticate(loginRequest);

        // ❗ Lỗi validation → BAD REQUEST (400)
        if (!res.isSuccess() &&
                (res.getMessage().contains("required")
                        || res.getMessage().contains("must")
                        || res.getMessage().contains("only"))) {
            return ResponseEntity.badRequest().body(res);
        }

        // ❗ Sai username hoặc password → 401
        if (!res.isSuccess()) {
            return ResponseEntity.status(401).body(res);
        }

        // ✔ Đăng nhập thành công → 200
        return ResponseEntity.ok(res);
    }

}