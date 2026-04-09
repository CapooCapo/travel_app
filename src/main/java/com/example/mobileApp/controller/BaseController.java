package com.example.mobileApp.controller;

import java.util.Map;
import com.example.mobileApp.dto.response.ApiResponse;

public abstract class BaseController {

    protected <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .status("success")
                .message("Success")
                .data(data != null ? data : (T) Map.of())
                .build();
    }

    protected <T> ApiResponse<T> ok(T data, String message) {
        return ApiResponse.<T>builder()
                .status("success")
                .message(message)
                .data(data != null ? data : (T) Map.of())
                .build();
    }

    protected <T> ApiResponse<T> created(T data, String message) {
        return ApiResponse.<T>builder()
                .status("success")
                .message(message)
                .data(data != null ? data : (T) Map.of())
                .build();
    }

    protected <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status("error")
                .message(message)
                .data((T) Map.of())
                .build();
    }
}
