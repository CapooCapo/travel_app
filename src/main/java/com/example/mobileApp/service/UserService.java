package com.example.mobileApp.service;

import org.springframework.stereotype.Service;

import com.example.mobileApp.dto.response.UserResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.UserMapper;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;    

    public UserResponse getUserProfile(long id) {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return userMapper.profileResponse(user);
    }
}
