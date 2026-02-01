package com.example.demo.user.dto;

import com.example.demo.common.dto.ImageDTO;
import com.example.demo.user.domain.Role;

import java.util.Set;

public record UserProfileDTO(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        String phoneNumber,
        ImageDTO image,
        Set<Role> roles
) {}
