package com.example.demo.security.service;

import com.example.demo.security.dto.AuthResponse;
import com.example.demo.security.dto.LoginRequestDTO;

public interface AuthService {
    AuthResponse login(LoginRequestDTO loginRequest);
    AuthResponse refreshToken(String refreshToken);
}
