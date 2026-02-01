package com.example.demo.common.exception.business;


import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final Map<String, String> details;

    public BusinessException(String message, HttpStatus httpStatus, Map<String, String> details) {
        super(message);
        this.httpStatus = httpStatus;
        this.details = details;
    }
}