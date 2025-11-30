// package com.flogin.service;

// import com.flogin.entity.User;
// import com.flogin.repository.UserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Component;

// @Component
// public class PasswordMigration implements CommandLineRunner {

//     private final UserRepository userRepository;
//     private final BCryptPasswordEncoder passwordEncoder;

//     public PasswordMigration(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
//         this.userRepository = userRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     @Override
//     public void run(String... args) throws Exception {
//         userRepository.findAll().forEach(user -> {
//             String rawPassword = user.getPassword();

//             // Chỉ hash nếu password chưa hash (ví dụ kiểm tra độ dài < 20)
//             if (rawPassword.length() < 20) {
//                 String hashed = passwordEncoder.encode(rawPassword);
//                 user.setPassword(hashed);
//                 userRepository.save(user);
//                 System.out.println("Đã hash password cho user: " + user.getUsername());
//             }
//         });
//         System.out.println("Migration mật khẩu đã hoàn tất!");
//     }
// }
