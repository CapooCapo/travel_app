package com.example.mobileApp.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.entity.Interest;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ResourceNotFoundException;
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

    public UserResponse getUserProfile(long id) {
        User user = userRepository.findByIdWithInterests(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toProfileResponse(user);
    }

    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findByIdWithInterests(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
        return userMapper.toProfileResponse(user);
    }

    @Transactional
    public UserResponse updateUserInterests(Long userId, Set<Long> interestIds) {
        User user = userRepository.findByIdWithInterests(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setInterests(new HashSet<>(interestRepository.findAllById(interestIds)));
        userRepository.save(user); // ✅ was missing
        return userMapper.toProfileResponse(user); // ✅
    }

    public UserDataResponse exportUserData(Long userId) {
        User user = userRepository.findByIdWithInterests(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDataResponse res = new UserDataResponse();
        res.setUser(userMapper.toProfileResponse(user)); // ✅
        res.setReviews(reviewRepository.findAllByUserId(userId).stream()
                .map(reviewMapper::toResponse).toList());
        res.setBookmarks(bookmarkRepository.findAllByUserId(userId).stream()
                .map(bookmarkMapper::toResponse).toList());
        return res;
    }

    @Transactional
    public void deleteAccount(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        reviewRepository.deleteByUserId(userId);
        bookmarkRepository.deleteByUserId(userId);
        notificationRepository.deleteByUserId(userId);

        userRepository.deleteById(userId);
    }
}