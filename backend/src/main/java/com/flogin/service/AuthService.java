package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Spring inject bean

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]{3,50}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d).{6,100}$");

    // Authenticate user
    public LoginResponse authenticate(LoginRequest request) {
        System.out.println("=== LOGIN FUNCTION ĐÃ ĐƯỢC GỌI ===");
        if (request == null) {
            return new LoginResponse(false, "Request không được null", null);
        }

        String username = request.getUsername();
        String password = request.getPassword();

        String usernameError = validateUsername(username);
        if (usernameError != null) return new LoginResponse(false, usernameError, null);

        String passwordError = validatePassword(password);
        if (passwordError != null) return new LoginResponse(false, passwordError, null);

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) return new LoginResponse(false, "Username không tồn tại", null);

        User user = userOptional.get();

        System.out.println("== DEBUG LOGIN ==");
System.out.println("Input username: " + username);
System.out.println("Input password: " + password);
System.out.println("DB password hash: " + user.getPassword());
System.out.println("Matches? " + passwordEncoder.matches(password, user.getPassword()));

        // **So sánh password đã hash**
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return new LoginResponse(false, "Password không đúng", null);
        }

        String token = generateToken(username);
        return new LoginResponse(true, "Dang nhap thanh cong", token);
    }

    public String validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) return "Username is required";
        String trimmed = username.trim();
        if (trimmed.length() < 3 || trimmed.length() > 50) return "Username must be between 3 and 50 characters";
        if (!USERNAME_PATTERN.matcher(trimmed).matches())
            return "Username can only contain letters, numbers, dots, underscores, and hyphens";
        return null;
    }

    public String validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) return "Password is required";
        String trimmed = password.trim();
        if (trimmed.length() < 6 || trimmed.length() > 100) return "Password must be between 6 and 100 characters";
        if (!PASSWORD_PATTERN.matcher(trimmed).matches()) return "Password must contain both letters and numbers";
        return null;
    }

    private String generateToken(String username) {
        return "TOKEN_" + username + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }
}
