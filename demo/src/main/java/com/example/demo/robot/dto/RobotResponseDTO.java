package com.example.demo.robot.dto;

import com.example.demo.common.dto.ImageDTO;

public record RobotResponseDTO(
        Long id,
        String name,
        String description,
        ImageDTO image
) {
}
