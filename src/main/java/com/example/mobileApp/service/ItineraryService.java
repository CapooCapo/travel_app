package com.example.mobileApp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
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
import com.example.mobileApp.exception.ForbiddenException;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.ItineraryMapper;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.EventRepository;
import com.example.mobileApp.repository.ItineraryItemRepository;
import com.example.mobileApp.repository.ItineraryRepository;
import com.example.mobileApp.repository.UserRepository;
import java.time.LocalTime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ItineraryItemRepository itemRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final EventRepository eventRepository;
    private final ItineraryMapper itineraryMapper;

    // ================= CREATE =================
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
                .notes(request.getNotes())
                .publicFlag(false)
                .build();

        itineraryRepository.save(itinerary);

        return itineraryMapper.toResponse(itinerary, Map.of());
    }

    // ================= LIST =================
    public List<ItineraryResponse> getUserItineraries(Long userId) {
        return itineraryRepository
                .findAllByUserIdOrderByStartDateAsc(userId)
                .stream()
                .map(it -> itineraryMapper.toResponse(it, Map.of()))
                .toList();
    }

    // ================= DETAIL =================
    public ItineraryResponse getItinerary(Long userId, Long itineraryId) {

        Itinerary itinerary = itineraryRepository
                .findByIdAndUserId(itineraryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        List<ItineraryItem> items = itemRepository.findByItineraryId(itineraryId);

        Map<LocalDate, List<ItineraryItemResponse>> itemsByDate = items.stream()
                .map(itineraryMapper::toResponse)
                .collect(Collectors.groupingBy(
                        ItineraryItemResponse::getDate,
                        TreeMap::new,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.stream()
                                        .sorted(this::compareItem)
                                        .toList())));

        return itineraryMapper.toResponse(itinerary, itemsByDate);
    }

    // ================= ADD ITEM =================
    @Transactional
    public ItineraryItemResponse addItem(Long userId, Long itineraryId, AddItineraryItemRequest req) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(userId)) {
            throw new ForbiddenException("No permission");
        }

        // Validate date
        if (req.getDate().isBefore(itinerary.getStartDate()) ||
                req.getDate().isAfter(itinerary.getEndDate())) {
            throw new IllegalArgumentException("Date is outside itinerary range");
        }

        // Validate time
        if (req.getStartTime() != null && req.getEndTime() != null &&
                req.getStartTime().isAfter(req.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Validate reference
        validateReference(req);

        Integer orderIndex = generateOrderIndex(itineraryId, req.getDate());

        ItineraryItem item = ItineraryItem.builder()
                .itinerary(itinerary)
                .type(req.getType())
                .referenceId(req.getReferenceId())
                .date(req.getDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .note(req.getNote())
                .orderIndex(orderIndex)
                .build();

        itemRepository.save(item);

        return itineraryMapper.toResponse(item);
    }

    // ================= DELETE ITEM =================
    @Transactional
    public void deleteItem(Long userId, Long itemId) {

        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!item.getItinerary().getUser().getId().equals(userId)) {
            throw new ForbiddenException("No permission");
        }

        itemRepository.delete(item);
    }

    // ================= DELETE ITINERARY =================
    @Transactional
    public void deleteItinerary(Long userId, Long itineraryId) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(userId)) {
            throw new ForbiddenException("No permission");
        }

        itineraryRepository.delete(itinerary);
    }

    // ================= SHARE =================
    @Transactional
    public String shareItinerary(Long userId, Long itineraryId) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(userId)) {
            throw new ForbiddenException("No permission");
        }

        itinerary.setPublicFlag(true);
        itineraryRepository.save(itinerary);

        return "https://your-app.com/itinerary/" + itineraryId;
    }

    @Transactional
    public void updateItineraryNotes(Long userId, Long itineraryId, String notes) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(userId)) {
            throw new ForbiddenException("No permission");
        }

        itinerary.setNotes(notes);
        itineraryRepository.save(itinerary);
    }

    // ================= PRIVATE =================

    private void validateReference(AddItineraryItemRequest req) {
    switch (req.getType()) {
        case LOCATION -> {
            if (!locationRepository.existsById(req.getReferenceId())) {
                throw new ResourceNotFoundException("Location not found");
            }
        }
        case EVENT -> {
            if (!eventRepository.existsById(req.getReferenceId())) {
                throw new ResourceNotFoundException("Event not found");
            }
        }
        default -> throw new IllegalArgumentException("Invalid item type");
    }
}

    private Integer generateOrderIndex(Long itineraryId, LocalDate date) {
        Integer max = itemRepository.findMaxOrderIndex(itineraryId, date).orElse(0);
        return max + 1;
    }

    private int compareItem(ItineraryItemResponse a, ItineraryItemResponse b) {

        // null time xuống cuối
        if (a.getStartTime() == null && b.getStartTime() != null)
            return 1;
        if (a.getStartTime() != null && b.getStartTime() == null)
            return -1;

        if (a.getStartTime() != null && b.getStartTime() != null) {
            int cmp = a.getStartTime().compareTo(b.getStartTime());
            if (cmp != 0)
                return cmp;
        }

        return Integer.compare(
                a.getOrderIndex() != null ? a.getOrderIndex() : 0,
                b.getOrderIndex() != null ? b.getOrderIndex() : 0);
    }
}