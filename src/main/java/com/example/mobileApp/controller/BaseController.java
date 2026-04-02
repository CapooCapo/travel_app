package com.example.mobileApp.controller;

import com.example.mobileApp.dto.response.ApiResponse;

public abstract class BaseController {

    protected <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "Success", data, System.currentTimeMillis());
    }

    protected <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(200, message, data, System.currentTimeMillis());
    }

    protected <T> ApiResponse<T> created(T data, String message) {
        return new ApiResponse<>(201, message, data, System.currentTimeMillis());
    }
}
