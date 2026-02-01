package com.example.demo.competition.dto;

import com.example.demo.competition.domain.CompetitionStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CompetitionCreateDTO(
        @NotBlank(message = "Title cannot be blank")
        @Size(max = 50, message = "Title cannot exceed 50 characters")
        String title,
        @NotBlank(message = "Description cannot be blank")
        String description,
        @NotBlank(message = "Location cannot be blank")
        String location,
        @NotNull(message = "Status is required")
        CompetitionStatus status,
        @NotNull(message = "Start date is required")
        @FutureOrPresent(message = "Start date must be in the present or future")
        LocalDate startDate,
        @NotNull(message = "End date is required")
        @FutureOrPresent(message = "End date must be in the present or future")
        LocalDate endDate
) {
}
