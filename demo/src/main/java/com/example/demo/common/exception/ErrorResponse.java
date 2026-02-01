package com.example.demo.common.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponse {
    private String message;
    private Map<String, String> details;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
