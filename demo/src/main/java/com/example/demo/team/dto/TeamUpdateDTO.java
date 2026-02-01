package com.example.demo.team.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TeamUpdateDTO(
        @NotBlank(message = "Name cannot be blank")
        @Size(max = 50, message = "Name cannot exceed 50 characters")
        String name,
        String description
) {
}
