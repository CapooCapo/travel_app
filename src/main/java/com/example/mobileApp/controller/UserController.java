package com.example.mobileApp.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/api/users")
    public List<String> getAllUsers() {
        System.out.println("Đã gọi vào API Users!");
        return Arrays.asList("User A", "User B", "User C");
    }
}
