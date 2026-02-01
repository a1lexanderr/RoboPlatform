package com.example.demo.init;

import com.example.demo.user.domain.Role;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@Slf4j
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private final String adminUsername = "admin";
    private final String adminEmail = "admin@example.com";
    private final String adminPassword = "admin";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Проверка и возможное создание ролей и администратора...");

        Role adminRole = Role.ADMIN;
        Role userRole = Role.USER;

        Optional<User> existingAdmin = userRepository.findByUsername(adminUsername);
        if (existingAdmin.isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername(adminUsername);
            adminUser.setEmail(adminEmail);
            adminUser.setPhoneNumber("555 555 5555");
            adminUser.setPasswordHash(passwordEncoder.encode(adminPassword));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(userRole);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);
            log.info("Администратор {} успешно создан.", adminUsername);
        } else {
            log.info("Администратор {} уже существует.", adminUsername);
        }
    }
}
