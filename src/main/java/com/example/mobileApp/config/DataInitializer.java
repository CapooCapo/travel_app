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
            interestRepository.save(new Interest(null, "FOOD"));
            interestRepository.save(new Interest(null, "CULTURE"));
            interestRepository.save(new Interest(null, "SHOPPING"));
            interestRepository.save(new Interest(null, "NATURE"));
            interestRepository.save(new Interest(null, "ADVENTURE"));
        }
    }
}