package com.example.demo.user.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record UserUpdateDTO(
        @Size(min = 2, max = 50, message = "Имя должно содержать от 2 до 50 символов")
        String firstName,

        @Size(min = 2, max = 50, message = "Фамилия должна содержать от 2 до 50 символов")
        String lastName,

        @Pattern(regexp = "^\\+?[1-9][0-9]{7,14}$", message = "Неверный формат номера телефона")
        String phoneNumber
) {}