package com.example.mobileApp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mobileApp.dto.request.EventRequest;
import com.example.mobileApp.dto.response.EventResponse;
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.Interest;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.exception.ResourceNotFoundException;
import com.example.mobileApp.mapper.EventMapper;
import com.example.mobileApp.repository.EventRepository;
import com.example.mobileApp.repository.LocationRepository;
import com.example.mobileApp.repository.InterestRepository;
import com.example.mobileApp.repository.UserRepository;
import com.example.mobileApp.repository.specification.EventSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final LocationRepository locationRepository;
    private final InterestRepository interestRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;

    public Page<EventResponse> getFilteredEvents(
            String keyword, String category, Boolean isFree,
            BigDecimal minPrice, BigDecimal maxPrice,
            LocalDateTime startDate, LocalDateTime endDate,
            String lifecycleStatus, Double lat, Double lng, Double radius,
            int page, int size) {

        Specification<Event> spec = EventSpecification.filter(
                keyword, category, isFree, minPrice, maxPrice,
                startDate, endDate, lifecycleStatus, null,
                lat, lng, radius
        );

        return eventRepository.findAll(spec, PageRequest.of(page, size))
                .map(eventMapper::toResponse);
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return eventMapper.toResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, Long userId) {
        System.out.println(">>> CREATE EVENT HIT");
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Interest category = interestRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Location location = null;
        if (request.getLocationId() != null) {
            location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        } else if (request.getLatitude() != null && request.getLongitude() != null) {
            // Create a temporary/ad-hoc location or existing one
            // For now, assume it must be an existing location or we can auto-create if needed
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .price(request.getPrice())
                .category(category)
                .location(location)
                .createdBy(creator)
                .images(request.getImages())
                .status(Event.EventStatus.PENDING)
                .build();

        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request, Long userId) {
        System.out.println(">>> UPDATE EVENT HIT");
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only edit your own events");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setPrice(request.getPrice());
        
        if (!event.getCategory().getId().equals(request.getCategoryId())) {
            event.setCategory(interestRepository.findById(request.getCategoryId()).orElseThrow());
        }
        
        event.setImages(request.getImages());
        event.setStatus(Event.EventStatus.PENDING); // Reset status for re-approval

        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long id, Long userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own events");
        }

        eventRepository.delete(event);
    }

    public List<EventResponse> getMyEvents(Long userId) {
        return eventRepository.findByCreatedBy_Id(userId)
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    public Page<EventResponse> getEventsByLocation(Long locationId, int page, int size) {
        return eventRepository.findByLocationId(locationId, PageRequest.of(page, size))
                .map(eventMapper::toResponse);
    }
}