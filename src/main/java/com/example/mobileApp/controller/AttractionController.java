package com.example.mobileApp.controller;

import com.example.mobileApp.dto.AttractionDTO;
import com.example.mobileApp.service.AttractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;

    /**
     * GET /api/attractions/nearby?lat={lat}&lon={lon}
     * Returns attractions within 10 km sorted by distance.
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<AttractionDTO>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon
    ) {
        List<AttractionDTO> result = attractionService.getNearbyAttractions(lat, lon);
        return ResponseEntity.ok(result);
    }
}
