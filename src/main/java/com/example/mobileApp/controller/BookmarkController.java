package com.example.mobileApp.controller;

import java.util.List;

import com.example.mobileApp.security.CurrentUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.LocationResponse;
import com.example.mobileApp.service.BookmarkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookmarks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookmarkController extends BaseController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{locationId}")
    public ApiResponse<Void> addBookmark(
            @CurrentUser Long userId,
            @PathVariable Long locationId) {

        bookmarkService.addBookmark(userId, locationId);
        return ok(null, "Bookmark added");
    }

    @DeleteMapping("/{locationId}")
    public ApiResponse<Void> removeBookmark(
            @CurrentUser Long userId,
            @PathVariable Long locationId) {

        bookmarkService.removeBookmark(userId, locationId);
        return ok(null, "Bookmark removed");
    }

    @GetMapping
    public ApiResponse<List<LocationResponse>> getBookmarks(
            @CurrentUser Long userId) {

        List<LocationResponse> data = bookmarkService.getBookmarks(userId);
        return ok(data, "Success");
    }
}