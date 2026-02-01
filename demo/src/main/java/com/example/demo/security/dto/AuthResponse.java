package com.example.demo.security.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String username
) {}