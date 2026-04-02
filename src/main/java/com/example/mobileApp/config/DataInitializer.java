package com.example.mobileApp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.mobileApp.entity.Interest;
import com.example.mobileApp.repository.InterestRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final InterestRepository interestRepository;

    @Override
    public void run(String... args) {
        if (interestRepository.count() == 0) {
            // Khởi tạo theo đúng thứ tự ID 1 -> 6 của MASTER_INTERESTS ở Frontend
            interestRepository.save(new Interest(null, "Beaches"));
            interestRepository.save(new Interest(null, "Hiking"));
            interestRepository.save(new Interest(null, "Culture"));
            interestRepository.save(new Interest(null, "Food & Culinary"));
            interestRepository.save(new Interest(null, "Relaxation"));
            interestRepository.save(new Interest(null, "Photography"));
        }
    }
}