package com.example.demo.team.dto;

public record UserSummaryDTO(
        Long id,
        String username,
        String fullName,
        String avatarUrl
) {}