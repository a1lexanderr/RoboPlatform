package com.example.demo.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationFormCreateDTO(
        @NotNull(message = "Team ID cannot be null")
        Long teamId,

        @NotNull(message = "Competition ID cannot be null")
        Long competitionId,

        @NotBlank(message = "Team experience cannot be blank")
        @Size(max = 1000, message = "Team experience cannot exceed 1000 characters")
        String teamExperience,

        @NotBlank(message = "Robot specifications cannot be blank")
        @Size(max = 5000, message = "Robot specifications cannot exceed 5000 characters")
        String robotSpecifications,

        @Size(max = 2000, message = "Additional equipment cannot exceed 2000 characters")
        String additionalEquipment,

        @Size(max = 1000, message = "Special requirements cannot exceed 1000 characters")
        String specialRequirements
) {
}