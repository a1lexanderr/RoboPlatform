package com.example.demo.user.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public record Birthday(LocalDate birthday) {
    public Long getAge(LocalDate birthday) {
        return ChronoUnit.YEARS.between(birthday, LocalDate.now());
    }
}
