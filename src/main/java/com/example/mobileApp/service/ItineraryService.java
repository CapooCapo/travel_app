package com.example.mobileApp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.request.AddItineraryItemRequest;
import com.example.mobileApp.dto.request.CreateItineraryRequest;
import com.example.mobileApp.dto.response.ItineraryItemResponse;
import com.example.mobileApp.dto.response.ItineraryResponse;
import com.example.mobileApp.entity.Itinerary;
import com.example.mobileApp.entity.ItineraryItem;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ConflictException;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.ItineraryMapper;
import com.example.mobileApp.repository.ItineraryItemRepository;
import com.example.mobileApp.repository.ItineraryRepository;
import com.example.mobileApp.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ItineraryItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ItineraryMapper itineraryMapper;

    @Transactional
    public ItineraryResponse createItinerary(Long userId, CreateItineraryRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Itinerary itinerary = Itinerary.builder()
                .user(user)
                .title(request.getTitle())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        itinerary = itineraryRepository.save(itinerary);

        // Return empty itinerary structure
        return ItineraryResponse.builder()
                .id(itinerary.getId())
                .title(itinerary.getTitle())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .itemsByDate(Map.of())
                .build();
    }

    public List<ItineraryResponse> getUserItineraries(Long userId) {
        List<Itinerary> itineraries = itineraryRepository.findAllByUserIdOrderByStartDateAsc(userId);
        return itineraries.stream().map(it -> ItineraryResponse.builder()
                .id(it.getId())
                .title(it.getTitle())
                .startDate(it.getStartDate())
                .endDate(it.getEndDate())
                .build()).collect(Collectors.toList());
    }

    public ItineraryResponse getItinerary(Long userId, Long itineraryId) {
        Itinerary itinerary = itineraryRepository.findByIdAndUserId(itineraryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found or does not belong to user"));

        List<ItineraryItem> items = itemRepository.findByItineraryIdOrderByDateAscStartTimeAscOrderIndexAsc(itineraryId);

        // Group by Date for the Calendar View UI requirement
        Map<LocalDate, List<ItineraryItemResponse>> itemsByDate = items.stream()
                .map(itineraryMapper::toResponse)
                .collect(Collectors.groupingBy(ItineraryItemResponse::getDate));

        return ItineraryResponse.builder()
                .id(itinerary.getId())
                .title(itinerary.getTitle())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .itemsByDate(itemsByDate)
                .build();
    }

    @Transactional
    public ItineraryItemResponse addItem(Long userId, Long itineraryId, AddItineraryItemRequest request) {
        Itinerary itinerary = itineraryRepository.findByIdAndUserId(itineraryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found or does not belong to user"));

        // Validate date boundaries
        if (request.getDate().isBefore(itinerary.getStartDate()) || request.getDate().isAfter(itinerary.getEndDate())) {
            throw new IllegalArgumentException("Item date must be within itinerary date range");
        }

        // Logic check: Không cho trùng giờ nếu cùng ngày (Trừ khi allow override)
        if (request.getStartTime() != null && request.getEndTime() != null) {
            List<ItineraryItem> existingItems = itemRepository.findByItineraryIdAndDateOrderByStartTimeAscOrderIndexAsc(itineraryId, request.getDate());
            
            boolean overlaps = existingItems.stream()
                .filter(existing -> existing.getStartTime() != null && existing.getEndTime() != null)
                .anyMatch(existing -> 
                    // Overlap logic: A starts before B ends && A ends after B starts
                    request.getStartTime().isBefore(existing.getEndTime()) && 
                    request.getEndTime().isAfter(existing.getStartTime())
                );
            
            if (overlaps && Boolean.FALSE.equals(request.getOverrideConflict())) {
                log.warn("Time conflict detected for itinerary {} on date {}", itineraryId, request.getDate());
                throw new ConflictException("Time slot overlaps with an existing item. Please confirm to override.");
            }
        }

        // Auto-increment order_index for items without specific time
        Integer orderIndex = 0;
        if (request.getStartTime() == null) {
            List<ItineraryItem> items = itemRepository.findByItineraryIdAndDateOrderByStartTimeAscOrderIndexAsc(itineraryId, request.getDate());
            if (!items.isEmpty()) {
                orderIndex = items.stream()
                        .map(ItineraryItem::getOrderIndex)
                        .filter(idx -> idx != null)
                        .max(Integer::compareTo)
                        .orElse(0) + 1;
            }
        }

        ItineraryItem item = ItineraryItem.builder()
                .itinerary(itinerary)
                .type(request.getType())
                .referenceId(request.getReferenceId())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .note(request.getNote())
                .orderIndex(orderIndex)
                .build();

        item = itemRepository.save(item);
        return itineraryMapper.toResponse(item);
    }

    @Transactional
    public void deleteItem(Long userId, Long itemId) {
        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        // Verify ownership
        if (!item.getItinerary().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You do not have permission to delete this item");
        }

        itemRepository.delete(item);
    }
}
