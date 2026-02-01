package com.example.demo.team.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TeamMemberAddDTO(
        @NotNull(message = "User ID is required")
        Long userId,
        @NotBlank(message = "Role cannot be blank")
        String role
) {}

