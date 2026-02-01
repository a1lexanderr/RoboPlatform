package com.example.demo.application.dto;

import com.example.demo.application.domain.ApplicationStatus;

import java.time.LocalDateTime;

public record ApplicationFormSummaryDTO(
        Long id,
        String teamName,
        String competitionTitle,
        ApplicationStatus status,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt
) {
}