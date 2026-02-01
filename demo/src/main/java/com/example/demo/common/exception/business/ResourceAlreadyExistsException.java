package com.example.demo.common.exception.business;

import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Map;

public class ResourceAlreadyExistsException extends BusinessException {
    public ResourceAlreadyExistsException(String message
    ) {
        super(
                message,
                HttpStatus.CONFLICT,
                Collections.singletonMap("info", "Resource already exists")
        );
    }
}
