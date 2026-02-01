package com.example.demo.robot.dto;

import com.example.demo.common.dto.ImageDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RobotDTO(
        String name,
        String description
) {
}
