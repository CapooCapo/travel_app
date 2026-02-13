package com.example.mobileApp.mapper;

import org.springframework.stereotype.Component;

import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.entity.User;

@Component
public class UserMapper {
    public User toUser(RegisterRequest request){
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getConfirmPassword());
        user.setFullName(request.getFullName());
        return user;
    }
}
