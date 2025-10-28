package com.flogin.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    // For demo purposes we use a hardcoded user. In production use proper user store + hashed passwords.
    public boolean authenticate(String username, String password) {
        return "admin".equals(username) && "password".equals(password);
    }
}
