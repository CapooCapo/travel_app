package com.example.mobileApp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.mobileApp.dto.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiResponse<Void> res = new ApiResponse<>(
                404,
                ex.getMessage(),
                null,
                System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(ConflictException ex) {
        ApiResponse<Void> res = new ApiResponse<>(
                409,
                ex.getMessage(),
                null,
                System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(RuntimeException ex) {
        ApiResponse<Void> res = new ApiResponse<>(
                400,
                ex.getMessage(),
                null,
                System.currentTimeMillis()
        );
        return ResponseEntity.badRequest().body(res);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntime(RuntimeException ex) {
        ApiResponse<Void> res = new ApiResponse<>(
                400,
                ex.getMessage(),
                null,
                System.currentTimeMillis()
        );

        return ResponseEntity.badRequest().body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {

        ApiResponse<Void> res = new ApiResponse<>(
                500,
                "Internal server error",
                null,
                System.currentTimeMillis()
        );

        return ResponseEntity.internalServerError().body(res);
    }
}