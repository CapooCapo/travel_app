package com.example.mobileApp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.dto.response.PageResponse;
import com.example.mobileApp.security.CurrentUser;
import com.example.mobileApp.service.EventBookmarkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventBookmarkController extends BaseController {

    private final EventBookmarkService eventBookmarkService;

    @PostMapping("/{eventId}/bookmark")
    public ApiResponse<Void> bookmarkEvent(
            @CurrentUser Long userId,
            @PathVariable Long eventId) {
        eventBookmarkService.bookmarkEvent(userId, eventId);
        return ok(null, "Event bookmarked");
    }

    @DeleteMapping("/{eventId}/bookmark")
    public ApiResponse<Void> removeBookmark(
            @CurrentUser Long userId,
            @PathVariable Long eventId) {
        eventBookmarkService.removeBookmark(userId, eventId);
        return ok(null, "Bookmark removed");
    }

    @GetMapping("/me/bookmarks")
    public ApiResponse<PageResponse<EventResponse>> getMyBookmarks(
            @CurrentUser Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ok(PageResponse.of(eventBookmarkService.getBookmarkedEvents(userId, page, size)));
    }

    @GetMapping("/me/bookmarked-ids")
    public ApiResponse<List<Long>> getBookmarkedIds(@CurrentUser Long userId) {
        return ok(eventBookmarkService.getBookmarkedEventIds(userId));
    }
}
