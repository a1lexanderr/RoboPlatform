package com.example.demo.common.exception.business.robot;

import com.example.demo.common.exception.business.BusinessException;
import org.springframework.http.HttpStatus;

import java.util.Collections;

public class RobotNotFoundException extends BusinessException {
    public RobotNotFoundException(String message) {
        super(
                message,
                HttpStatus.NOT_FOUND,
                Collections.singletonMap("info", "Robot Not Found")
        );
    }
}
