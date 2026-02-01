package com.example.demo.common.exception.business.file;

import com.example.demo.common.exception.business.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Collections;

public class InvalidFileException extends BusinessException {
    public InvalidFileException(String message) {
        super(
                message,
                HttpStatus.BAD_REQUEST,
                Collections.singletonMap("info", "Please provide a valid file")
        );
    }
}