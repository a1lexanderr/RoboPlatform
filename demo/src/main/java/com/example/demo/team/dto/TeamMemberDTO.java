package com.example.demo.team.dto;

import jakarta.validation.constraints.NotBlank;

public record TeamMemberDTO(
        @NotBlank
        String fullName,
        @NotBlank
        String role
) {
}
