package com.example.mobileApp.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mobileApp.dto.response.ApiResponse;
import com.example.mobileApp.entity.Interest;
import com.example.mobileApp.repository.InterestRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController extends BaseController {

    private final InterestRepository interestRepository;

    @GetMapping
    public ApiResponse<List<CategoryDTO>> getCategories() {
        List<Interest> interests = interestRepository.findAll();
        List<CategoryDTO> dtos = interests.stream()
                .map(i -> new CategoryDTO(i.getId(), i.getName()))
                .collect(Collectors.toList());
        return ok(dtos);
    }

    public record CategoryDTO(Long id, String name) {}
}
