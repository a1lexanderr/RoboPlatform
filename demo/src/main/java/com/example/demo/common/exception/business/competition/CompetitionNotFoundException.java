package com.example.demo.common.exception.business.competition;

import com.example.demo.common.exception.business.BusinessException;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Map;

public class CompetitionNotFoundException extends BusinessException {
    public CompetitionNotFoundException(String message) {
        super(
                message,
                HttpStatus.NOT_FOUND,
                Collections.singletonMap("Error", "Competition not found"));
    }
}
