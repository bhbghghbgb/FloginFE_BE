package com.flogin.backend.config;

import com.flogin.backend.entity.Role;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
@Slf4j
public class DataLoader {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Kiểm tra nếu user test chưa tồn tại
            if (userRepository.findByUsername("testuser").isEmpty()) {
                User testUser = User.builder()
                    .username("testuser")
                    .password(passwordEncoder.encode("Test123"))
                    .email("testuser@example.com")
                    .active(true)
                    .role(Role.ADMIN)
                    .build();
                userRepository.save(testUser);
                log.info("Test user created: testuser / Test123");
            }
            Optional<User> useropt = userRepository.findByUsername("testuser");
            User user = useropt.get();
            if (user.getRole() == null) {
                user.setRole(Role.ADMIN);
                userRepository.save(user);
            }
        };
    }
}
