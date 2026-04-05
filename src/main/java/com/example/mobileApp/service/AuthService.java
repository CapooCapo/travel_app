package com.example.mobileApp.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Legacy AuthService. 
 * Most functionality moved to UserService (for Clerk synchronization) 
 * and handled by Clerk on the frontend.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    // Currently empty as all legacy auth methods were removed in favor of Clerk integration.
}