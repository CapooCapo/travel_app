package com.example.mobileApp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a user attempts to review a location they have already reviewed.
 * Mapped to HTTP 409 Conflict.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class AlreadyReviewedException extends RuntimeException {
    public AlreadyReviewedException(String message) {
        super(message);
    }
}
