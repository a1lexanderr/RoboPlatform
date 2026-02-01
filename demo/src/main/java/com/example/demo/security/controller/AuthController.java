package com.example.demo.security.controller;

import com.example.demo.security.dto.AuthResponse;
import com.example.demo.security.dto.LoginRequestDTO;
import com.example.demo.security.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequestDTO user){
        return ResponseEntity.ok(authService.login(user));
    }
}
