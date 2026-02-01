package com.example.demo.common.exception.business;

import org.springframework.http.HttpStatus;

import java.util.Collections;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String message) {
        super(
                message,
                HttpStatus.NOT_FOUND,
                Collections.singletonMap("info", "Resource not found")
        );
    }
}
