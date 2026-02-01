package com.example.demo.user.controller;

import com.example.demo.security.model.UserPrincipal;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.UserProfileDTO;
import com.example.demo.user.dto.UserRegistrationDTO;
import com.example.demo.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegistrationDTO user){
        UserDTO createdUser = userService.registerUser(user);
        return ResponseEntity
                .created(URI.create("/api/users/" + createdUser.id()))
                .body(createdUser);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDTO user = userService.getUser(principal.getUsername());
        return ResponseEntity.ok(user);
    }

}
