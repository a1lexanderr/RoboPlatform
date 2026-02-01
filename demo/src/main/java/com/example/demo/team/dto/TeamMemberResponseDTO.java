package com.example.demo.team.dto;

public record TeamMemberResponseDTO(
        Long memberRecordId,
        Long userId,
        String username,
        String firstName,
        String lastName,
        String role
) {}
