package com.example.demo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationDTO(
        @NotBlank @Size(min = 2, max = 50)
        String firstName,
        @NotBlank @Size(min = 2, max = 50)
        String lastName,
        @NotBlank @Size(min = 3, max = 30)
        String username,
        @NotBlank @Email
        String email,
        @Pattern(regexp = "^\\+?[1-9][0-9]{7,14}$")
        String phoneNumber,

        @NotBlank @Size(min = 8, max = 32)
        String password
) {}


