package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.AttractionResponse;
import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.entity.Bookmark;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.AttractionMapper;
import com.example.mobileApp.repository.AttractionRepository;
import com.example.mobileApp.repository.BookmarkRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final AttractionMapper attractionMapper; // thêm cái này

    public void addBookmark(Long userId, Long attractionId) {

        if (userId == null) {
            throw new RuntimeException("Unauthorized");
        }

        if (bookmarkRepository.existsByUserIdAndAttractionId(userId, attractionId)) {
            return;
        }

        User user = userRepository.findById(userId).orElseThrow();
        Attraction attraction = attractionRepository.findById(attractionId).orElseThrow();

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setAttraction(attraction);

        bookmarkRepository.save(bookmark);
    }

    public void removeBookmark(Long userId, Long attractionId) {
        bookmarkRepository.deleteByUserIdAndAttractionId(userId, attractionId);
    }

    public List<AttractionResponse> getBookmarks(Long userId) {

        return bookmarkRepository
                .findByUserId(userId)
                .stream()
                .map(Bookmark::getAttraction)
                .map(attractionMapper::toResponse) // convert ở đây
                .toList();
    }
}