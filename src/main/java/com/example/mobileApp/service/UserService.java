package com.example.mobileApp.service;

import java.util.HashSet;
import java.util.Set;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;

import com.example.mobileApp.dto.request.UpdateUserRequest;
import com.example.mobileApp.dto.response.UserDataResponse;
import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ApiException;
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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final InterestRepository interestRepository;
    private final ReviewRepository reviewRepository;
    private final BookmarkRepository bookmarkRepository;
    private final NotificationRepository notificationRepository;
    private final UserMapper userMapper;
    private final ReviewMapper reviewMapper;
    private final BookmarkMapper bookmarkMapper;
    private final ClerkService clerkService;

    public UserResponse getUserProfile(long id) {
        User user = userRepository.findByIdWithInterests(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toProfileResponse(user);
    }

    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) user.setGender(User.Gender.valueOf(request.getGender()));
        if (request.getTravelStyle() != null) user.setTravelStyle(User.TravelStyle.valueOf(request.getTravelStyle()));

        if (request.getInterestIds() != null) {
            Set<com.example.mobileApp.entity.Interest> interests = new HashSet<>(interestRepository.findAllByIdIn(new java.util.ArrayList<>(request.getInterestIds())));
            user.setInterests(interests);
        }

        return userMapper.toProfileResponse(userRepository.save(user));
    }

    public UserResponse updateUserInterests(Long userId, Set<Long> interestIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Set<com.example.mobileApp.entity.Interest> interests = new HashSet<>(interestRepository.findAllByIdIn(new java.util.ArrayList<>(interestIds)));
        user.setInterests(interests);
        return userMapper.toProfileResponse(userRepository.save(user));
    }

    public UserDataResponse exportUserData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserDataResponse response = new UserDataResponse();
        response.setUser(userMapper.toProfileResponse(user));
        response.setReviews(reviewRepository.findAllByUserId(userId).stream().map(reviewMapper::toResponse).toList());
        response.setBookmarks(bookmarkRepository.findAllByUserId(userId).stream().map(bookmarkMapper::toResponse).toList());
        return response;
    }

    @Transactional
    public void deleteAccount(Long userId) {
        reviewRepository.deleteByUserId(userId);
        bookmarkRepository.deleteByUserId(userId);
        notificationRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    @Transactional
    public com.example.mobileApp.dto.response.SyncResult syncClerkUser(Jwt jwt) {
        String clerkId = jwt.getSubject();
        
        // Extract claims
        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getClaimAsString("primary_email");
        
        String fullName = jwt.getClaimAsString("full_name");
        String imageUrl = jwt.getClaimAsString("image_url");
        String genderStr = jwt.getClaimAsString("gender");
        String travelStyleStr = jwt.getClaimAsString("travel_style");
        Object rawInterests = jwt.getClaim("interests");

        // Fallback to Clerk API if email missing
        if (email == null || email.trim().isEmpty()) {
            Map<String, Object> clerkUser = clerkService.getUserDetails(clerkId);
            if (clerkUser != null) {
                email = clerkService.getPrimaryEmail(clerkUser);
                if (fullName == null) fullName = (String) clerkUser.get("first_name") + " " + clerkUser.get("last_name");
                if (imageUrl == null) imageUrl = (String) clerkUser.get("image_url");
            }
        }

        if (email == null || email.trim().isEmpty()) {
            throw new ApiException(400, "Email is required for synchronization.");
        }

        final String finalEmail = email.toLowerCase().trim();
        final String finalFullName = fullName;
        final String finalImageUrl = imageUrl;
        final String finalGender = genderStr;
        final String finalTravelStyle = travelStyleStr;

        // Idempotent sync logic:
        // 1. Try finding by Clerk ID
        return userRepository.findByClerkId(clerkId)
            .map(user -> {
                log.debug("Found existing user by clerkId: {}. Updating profile.", clerkId);
                updateUserFromClaims(user, finalEmail, finalFullName, finalImageUrl, finalGender, finalTravelStyle, rawInterests);
                return new com.example.mobileApp.dto.response.SyncResult(userRepository.save(user), false);
            })
            .orElseGet(() -> {
                // 2. Not found by Clerk ID, try finding by Email
                return userRepository.findByEmail(finalEmail)
                    .map(existingUser -> {
                        log.info("Found existing user by email: {}. Linking to clerkId: {}.", finalEmail, clerkId);
                        existingUser.setClerkId(clerkId);
                        existingUser.setProvider(User.AuthProvider.CLERK);
                        updateUserFromClaims(existingUser, finalEmail, finalFullName, finalImageUrl, finalGender, finalTravelStyle, rawInterests);
                        return new com.example.mobileApp.dto.response.SyncResult(userRepository.save(existingUser), false);
                    })
                    .orElseGet(() -> {
                        // 3. New user entirely
                        log.info("No matching record. Performing clean INSERT for clerkId: {}", clerkId);
                        User newUser = new User();
                        newUser.setClerkId(clerkId);
                        newUser.setProvider(User.AuthProvider.CLERK);
                        newUser.setVerified(true);
                        newUser.setRole(User.Role.USER);
                        updateUserFromClaims(newUser, finalEmail, finalFullName, finalImageUrl, finalGender, finalTravelStyle, rawInterests);
                        return new com.example.mobileApp.dto.response.SyncResult(userRepository.save(newUser), true);
                    });
            });
    }

    private void updateUserFromClaims(User user, String email, String fullName, String imageUrl, String gender, String travelStyle, Object rawInterests) {
        user.setEmail(email);
        user.setImageUrl(imageUrl);
        
        // Handle Full Name -> First/Last
        if (fullName != null && !fullName.trim().isEmpty()) {
            String[] parts = fullName.trim().split("\\s+", 2);
            user.setFirstName(parts[0]);
            if (parts.length > 1) {
                user.setLastName(parts[1]);
            }
        }

        // Handle Enums support Case-Insensitive (as requested: 'user'/'USER')
        if (gender != null) {
            try {
                user.setGender(User.Gender.valueOf(gender.trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid gender value: {}", gender);
            }
        }

        if (travelStyle != null) {
            try {
                user.setTravelStyle(User.TravelStyle.valueOf(travelStyle.trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid travel style value: {}", travelStyle);
            }
        }

        // Handle Interests (Already handles collection or string)
        syncInterestsFromObject(user, rawInterests);
    }

    private void syncInterestsFromObject(User user, Object rawInterests) {
        if (rawInterests == null) return;

        Set<String> interestNames = new HashSet<>();
        if (rawInterests instanceof String) {
            String str = (String) rawInterests;
            for (String s : str.split(",")) {
                if (!s.trim().isEmpty()) interestNames.add(s.trim());
            }
        } else if (rawInterests instanceof java.util.Collection) {
            java.util.Collection<?> col = (java.util.Collection<?>) rawInterests;
            for (Object o : col) {
                if (o != null) interestNames.add(o.toString().trim());
            }
        }

        if (interestNames.isEmpty()) return;

        Set<com.example.mobileApp.entity.Interest> interests = new HashSet<>();
        for (String name : interestNames) {
            // Title case formatting: "music" -> "Music"
            String formattedName = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
            com.example.mobileApp.entity.Interest interest = interestRepository.findByName(formattedName)
                    .orElseGet(() -> {
                        com.example.mobileApp.entity.Interest newInterest = new com.example.mobileApp.entity.Interest();
                        newInterest.setName(formattedName);
                        return interestRepository.save(newInterest);
                    });
            interests.add(interest);
        }
        user.setInterests(interests);
    }

    public java.util.List<com.example.mobileApp.dto.UserDTO> searchUsers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(userMapper::toUserDTO)
                .toList();
    }
}