package com.example.mobileApp.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.entity.Interest;
import com.example.mobileApp.entity.Notification;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.BookmarkMapper;
import com.example.mobileApp.mapper.ReviewMapper;
import com.example.mobileApp.mapper.UserMapper;
import com.example.mobileApp.repository.BookmarkRepository;
import com.example.mobileApp.repository.InterestRepository;
import com.example.mobileApp.repository.NotificationRepository;
import com.example.mobileApp.repository.ReviewRepository;
import com.example.mobileApp.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InterestRepository interestRepository;

    private final ReviewRepository reviewRepository;
    private final BookmarkRepository bookmarkRepository;
    private final NotificationRepository notificationRepository;

    private final UserMapper userMapper;
    private final ReviewMapper reviewMapper;
    private final BookmarkMapper bookmarkMapper;

    // #region (User Profile)
    public UserResponse getUserProfile(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return userMapper.profileResponse(user);
    }
    // #endregion

    // #region (Update User Profile)
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null)
            user.setFullName(request.getFullName().trim());

        if (request.getDateOfBirth() != null)
            user.setDateOfBirth(request.getDateOfBirth());

        if (request.getGender() != null)
            user.setGender(request.getGender());

        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());

        if (request.getTravelStyle() != null)
            user.setTravelStyle(request.getTravelStyle());

        userRepository.save(user);

        return userMapper.profileResponse(user);
    }
    // #endregion

    // #region (Update Interests)
    @Transactional
    public UserResponse updateUserInterests(Long userId, Set<Long> interestIds) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Interest> interests = new HashSet<>(
                interestRepository.findAllById(interestIds));

        user.setInterests(interests);

        return userMapper.profileResponse(user);
    }
    // #endregion

    public void createNotification(Long userId, String title, String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setIsRead(false);
        n.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(n);
    }

    public UserDataResponse exportUserData(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDataResponse res = new UserDataResponse();

        res.setUser(userMapper.profileResponse(user));

        res.setReviews(
                reviewRepository.findAllByUserId(userId)
                        .stream()
                        .map(reviewMapper::toResponse)
                        .toList());

        res.setBookmarks(
                bookmarkRepository.findAllByUserId(userId)
                        .stream()
                        .map(bookmarkMapper::toResponse)
                        .toList());

        return res;
    }

    @Transactional
    public void deleteAccount(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        reviewRepository.deleteByUserId(userId);
        bookmarkRepository.deleteByUserId(userId);
        notificationRepository.deleteByUserId(userId);

        userRepository.deleteById(userId);
    }
}