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
import com.example.mobileApp.entity.ItemType;
import com.example.mobileApp.entity.Itinerary;
import com.example.mobileApp.entity.ItineraryItem;
import com.example.mobileApp.entity.TargetType;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ForbiddenException;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.ItineraryMapper;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.EventRepository;
import com.example.mobileApp.repository.ItineraryItemRepository;
import com.example.mobileApp.repository.ItineraryRepository;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.entity.ActivityType;

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
    private final ActivityService activityService;

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

        // 📝 Record Activity (Resilient)
        try {
            activityService.recordActivity(
                userId,
                ActivityType.ITINERARY_CREATED,
                TargetType.ITINERARY,
                itinerary.getId(),
                itinerary.getTitle());
        } catch (Exception e) {
            // Non-blocking: we continue even if logging fails
        }

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
                .locationId(req.getLocationId())
                .eventId(req.getEventId())
                .date(req.getDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .note(req.getNote())
                .orderIndex(orderIndex)
                .build();

        itemRepository.save(item);

        // 📝 Record Activity for adding item (Resilient)
        try {
            if (item.getType() == ItemType.LOCATION) {
                activityService.recordActivity(
                    userId,
                    ActivityType.LOCATION_ADDED,
                    TargetType.LOCATION,
                    item.getLocationId(),
                    itinerary.getTitle() // Context: added to which itinerary
                );
            } else if (item.getType() == ItemType.EVENT) {
                activityService.recordActivity(
                    userId,
                    ActivityType.EVENT_JOINED,
                    TargetType.EVENT,
                    item.getEventId(),
                    itinerary.getTitle()
                );
            }
        } catch (Exception e) {
            log.error("[ACTIVITY ERROR] Failed to record itinerary item activity: {}", e.getMessage());
        }

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
        // Strict XOR check at service level
        if (req.getLocationId() != null && req.getEventId() != null) {
            throw new IllegalArgumentException("An item cannot be both a location and an event");
        }
        if (req.getLocationId() == null && req.getEventId() == null) {
            throw new IllegalArgumentException("Either locationId or eventId must be provided");
        }

        switch (req.getType()) {
            case LOCATION -> {
                if (req.getLocationId() == null) {
                    throw new IllegalArgumentException("locationId is required for type LOCATION");
                }
                if (!locationRepository.existsById(req.getLocationId())) {
                    throw new ResourceNotFoundException("Location not found: " + req.getLocationId());
                }
            }
            case EVENT -> {
                if (req.getEventId() == null) {
                    throw new IllegalArgumentException("eventId is required for type EVENT");
                }
                if (!eventRepository.existsById(req.getEventId())) {
                    throw new ResourceNotFoundException("Event not found with ID: " + req.getEventId());
                }
            }
            default -> throw new IllegalArgumentException("Invalid item type: " + req.getType());
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