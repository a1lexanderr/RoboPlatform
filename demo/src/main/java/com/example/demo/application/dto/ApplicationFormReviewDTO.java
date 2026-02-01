package com.example.demo.application.dto;

import com.example.demo.application.domain.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationFormReviewDTO(
        @NotNull(message = "Status cannot be null")
        ApplicationStatus status,

        @Size(max = 2000, message = "Admin comment cannot exceed 2000 characters")
        String adminComment
) {
}