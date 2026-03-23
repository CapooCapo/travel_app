package com.example.mobileApp.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.service.BookmarkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    private <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(
                200,
                message,
                data,
                System.currentTimeMillis());
    }

    @PostMapping("/{attractionId}")
    public ApiResponse<Void> addBookmark(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long attractionId) {

        bookmarkService.addBookmark(userId, attractionId);
        return ok(null, "Bookmark added");
    }

    @DeleteMapping("/{attractionId}")
    public ApiResponse<Void> removeBookmark(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long attractionId) {

        bookmarkService.removeBookmark(userId, attractionId);
        return ok(null, "Bookmark removed");
    }

    @GetMapping
    public ApiResponse<List<AttractionResponse>> getBookmarks(
            @AuthenticationPrincipal Long userId) {

        List<AttractionResponse> data = bookmarkService.getBookmarks(userId);
        return ok(data, "Success");
    }
}