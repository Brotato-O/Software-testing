package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Câu 2.1.2: Backend Unit Tests - Login Service (5 điểm)
 * AuthService handles user authentication using MySQL database
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Validation patterns
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]{3,50}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d).{6,100}$");

    /**
     * Câu 2.1.2.a: Authenticate user with username and password (3 điểm)
     * 
     * @param request LoginRequest containing username and password
     * @return LoginResponse with success status, message, and token
     */
    public LoginResponse authenticate(LoginRequest request) {
        // Validate request
        if (request == null) {
            return new LoginResponse(false, "Request không được null", null);
        }

        String username = request.getUsername();
        String password = request.getPassword();

        // Validate username
        String usernameError = validateUsername(username);
        if (usernameError != null) {
            return new LoginResponse(false, usernameError, null);
        }

        // Validate password
        String passwordError = validatePassword(password);
        if (passwordError != null) {
            return new LoginResponse(false, passwordError, null);
        }

        // Check if user exists in database
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return new LoginResponse(false, "Username không tồn tại", null);
        }

        // Check if password matches
        User user = userOptional.get();
        if (!user.getPassword().equals(password)) {
            return new LoginResponse(false, "Password không đúng", null);
        }

        // Login successful - generate token
        String token = generateToken(username);
        return new LoginResponse(true, "Dang nhap thanh cong", token);
    }

    /**
     * Câu 2.1.2.b: Validate username format (1 điểm)
     * 
     * @param username to validate
     * @return error message if invalid, null if valid
     */
    public String validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return "Username is required";
        }

        String trimmed = username.trim();

        if (trimmed.length() < 3 || trimmed.length() > 50) {
            return "Username must be between 3 and 50 characters";
        }

        if (!USERNAME_PATTERN.matcher(trimmed).matches()) {
            return "Username can only contain letters, numbers, dots, underscores, and hyphens";
        }

        return null; // Valid
    }

    /**
     * Câu 2.1.2.b: Validate password format (1 điểm)
     * 
     * @param password to validate
     * @return error message if invalid, null if valid
     */
    public String validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return "Password is required";
        }

        String trimmed = password.trim();

        if (trimmed.length() < 6 || trimmed.length() > 100) {
            return "Password must be between 6 and 100 characters";
        }

        if (!PASSWORD_PATTERN.matcher(trimmed).matches()) {
            return "Password must contain both letters and numbers";
        }

        return null; // Valid
    }

    /**
     * Generate a simple token for authenticated user
     * 
     * @param username username
     * @return token string
     */
    private String generateToken(String username) {
        // Simple token: TOKEN_<username>_<UUID>
        return "TOKEN_" + username + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Check if user exists in the system
     * 
     * @param username username to check
     * @return true if user exists
     */
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }
}
