package com.example.demo.common.exception.business.team;

import com.example.demo.common.exception.business.BusinessException;
import org.springframework.http.HttpStatus;

import java.util.Collections;

public class TeamNotFoundException extends BusinessException {
    public TeamNotFoundException(String message) {
        super(
                message,
                HttpStatus.NOT_FOUND,
                Collections.singletonMap("Error", "Team not found")
        );
    }
}
