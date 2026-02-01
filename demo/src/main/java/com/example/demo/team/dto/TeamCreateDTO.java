package com.example.demo.team.dto;

import com.example.demo.common.dto.ImageDTO;
import com.example.demo.robot.dto.RobotDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TeamCreateDTO(
        @NotBlank(message = "Name cannot be blank")
        @Size(max = 50, message = "Name cannot exceed 50 characters")
        String name,
        String description
) {
}
