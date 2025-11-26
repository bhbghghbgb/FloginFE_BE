package com.flogin.backend.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private Boolean success;
    private String message;
    private LocalDateTime timestamp;

    // Add an optional field for HTTP Status code if you want to include it in the body
    private int status;

    // You might also want a field for the error type/path
    private String error;
    private String path;
}