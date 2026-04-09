package com.example.mobileApp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.BookmarkDTO;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Bookmark;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.BookmarkRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

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

    public List<BookmarkDTO> getBookmarksByUser(Long userId) {
        return bookmarkRepository.findByUserId(userId)
                .stream()
                .map(bookmark -> {
                    Location loc = bookmark.getLocation();
                    String firstImage = loc.getImages() != null && !loc.getImages().isEmpty() 
                        ? loc.getImages().get(0).getImageUrl() 
                        : null;
                        
                    return BookmarkDTO.builder()
                            .id(bookmark.getId())
                            .locationId(loc.getId())
                            .name(loc.getName())
                            .description(loc.getDescription())
                            .address(loc.getAddress())
                            .imageUrl(firstImage)
                            .latitude(loc.getLatitude())
                            .longitude(loc.getLongitude())
                            .category(loc.getInterests() != null && !loc.getInterests().isEmpty() 
                                ? loc.getInterests().iterator().next().getName() 
                                : null)
                            .build();
                })
                .toList();
    }
}