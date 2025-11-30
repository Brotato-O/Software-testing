package com.flogin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // ---- Ép HTTPS
        http.requiresChannel(channel -> channel
                .anyRequest().requiresSecure());

        // ---- CSRF tắt vì API
        http.csrf(csrf -> csrf.disable());

        // ---- Quyền truy cập
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated());

        // ---- Tắt form login và logout mặc định
        http.formLogin(login -> login.disable());
        http.logout(logout -> logout.disable());

        // Security headers
        http.headers(headers -> {
            headers.contentSecurityPolicy(
                    "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none';");
            headers.referrerPolicy(policy -> policy.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN));
            headers.addHeaderWriter((request, response) -> {
                response.setHeader("X-XSS-Protection", "1; mode=block");
            });
            headers.contentTypeOptions();
            headers.frameOptions(frame -> frame.sameOrigin());
            headers.httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000));
        });

        return http.build();
    }
}