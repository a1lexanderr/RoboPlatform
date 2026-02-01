package com.example.demo.team.dto;

public record TeamForUserDTO(
        Long id,
        String name,
        String description,
        String role,
        String image
) {
}
