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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        LoginResponse res = authService.authenticate(loginRequest);

        // 🔥 Validation errors — return 400 nếu message chứa required/must/only
        if (!res.isSuccess()) {
            String msg = res.getMessage().toLowerCase();

            if (msg.contains("required") || msg.contains("must") || msg.contains("only")) {
                return ResponseEntity.badRequest().body(res);       // 400
            }
            return ResponseEntity.status(401).body(res);            // 401
        }

        // ✔ Success → 200
        return ResponseEntity.ok(res);
    }


}