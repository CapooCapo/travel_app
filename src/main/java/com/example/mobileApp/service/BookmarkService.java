package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.LocationResponse;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Bookmark;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.LocationMapper;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.BookmarkRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public void addBookmark(Long userId, Long locationId) {

        if (userId == null) {
            throw new RuntimeException("Unauthorized");
        }

        if (bookmarkRepository.existsByUserIdAndLocationId(userId, locationId)) {
            return;
        }

        User user = userRepository.findById(userId).orElseThrow();
        Location location = locationRepository.findById(locationId).orElseThrow();

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setLocation(location);

        bookmarkRepository.save(bookmark);
    }

    public void removeBookmark(Long userId, Long locationId) {
        bookmarkRepository.deleteByUserIdAndLocationId(userId, locationId);
    }

    public List<LocationResponse> getBookmarks(Long userId) {

        return bookmarkRepository
                .findByUserId(userId)
                .stream()
                .map(Bookmark::getLocation)
                .map(locationMapper::toResponse) // convert ở đây
                .toList();
    }
}