package com.example.demo.competition.dto;

import com.example.demo.common.dto.ImageDTO;
import com.example.demo.competition.domain.CompetitionStatus;

import java.time.LocalDate;

public record CompetitionSummaryDTO(
        Long id,
        String title,
        String description,
        String location,
        String image,
        CompetitionStatus status,
        LocalDate startDate,
        LocalDate endDate
) {
}
