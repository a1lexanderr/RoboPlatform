package com.example.demo.application.dto;

import com.example.demo.application.domain.ApplicationStatus;

import java.time.LocalDateTime;

public record ApplicationFormResponseDTO(
        Long id,
        Long teamId,
        String teamName,
        Long competitionId,
        String competitionTitle,
        ApplicationStatus status,
        String teamExperience,
        String robotSpecifications,
        String additionalEquipment,
        String specialRequirements,
        String adminComment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime reviewedAt,
        String reviewedByUsername
) {
}