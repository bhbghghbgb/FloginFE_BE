package com.flogin.backend.exception;

import com.flogin.backend.config.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        log.warn("Entity not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
            .success(false)
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    // ... keep other exception handlers
}