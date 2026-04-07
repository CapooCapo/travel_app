package com.example.mobileApp.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import com.example.mobileApp.entity.Location;
import com.example.mobileApp.repository.LocationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OsmService {

    private final WebClient.Builder webClientBuilder;
    private final LocationRepository locationRepository;
    private final ObjectMapper objectMapper;

    private static final String OVERPASS_URL = "https://overpass-api.de/api/interpreter";

    public List<Location> fetchNearbyPois(Double latitude, Double longitude, Set<String> interestTags, Long userId) {
        double initialRadius = 3000.0;
        String query = buildOverpassQuery(latitude, longitude, interestTags, initialRadius);
        log.info("🔍 [User: {}] OSM Fetch (lat={}, lon={}, radius={})", userId, latitude, longitude, initialRadius);
        
        JsonNode root = fetchWithRetry(query, 2, userId);
        
        if (isEmpty(root)) {
            log.warn("⚠️ [User: {}] No results at 3km. Expanding to 10km...", userId);
            query = buildOverpassQuery(latitude, longitude, interestTags, 10000.0);
            root = fetchWithRetry(query, 1, userId);
        }

        if (isEmpty(root)) {
            log.warn("⚠️ [User: {}] No OSM elements found for user interests.", userId);
            return new ArrayList<>();
        }

        JsonNode elements = root.get("elements");
        log.info("✅ [User: {}] OSM Task: Found {} elements", userId, elements.size());

        List<Location> savedLocations = new ArrayList<>();
        int savedCount = 0;

        for (JsonNode element : elements) {
            try {
                Location location = mapToLocation(element);
                if (location != null) {
                    try {
                        // Attempt to save. The @UniqueConstraint in Location entity handles duplicates.
                        // We use a separate transaction for each save if possible, or just handle errors.
                        if (!locationRepository.existsByExternalIdAndSource(location.getExternalId(), "OSM")) {
                            locationRepository.saveAndFlush(location);
                            savedLocations.add(location);
                            savedCount++;
                        }
                    } catch (DataIntegrityViolationException e) {
                        log.info("ℹ️ [User: {}] POI {} already saved by another process.", userId, location.getExternalId());
                    }
                }
            } catch (Exception e) {
                log.error("❌ [User: {}] Error processing element", userId, e);
            }
        }

        log.info("🚀 [User: {}] Saved {} new locations.", userId, savedCount);
        return savedLocations;
    }

    private boolean isEmpty(JsonNode root) {
        return root == null || !root.has("elements") || root.get("elements").isEmpty();
    }

    private String buildOverpassQuery(Double lat, Double lng, Set<String> tags, double radius) {
        Set<String> queryTags = (tags == null || tags.isEmpty()) 
            ? Set.of("amenity", "tourism", "shop", "historic", "leisure") 
            : tags;

        StringBuilder queryBuilder = new StringBuilder("[out:json][timeout:15];(");
        for (String tag : queryTags) {
            if (tag.contains("=")) {
                String[] parts = tag.split("=");
                queryBuilder.append(String.format("nwr[\"%s\"~\"%s\"](around:%f,%f,%f);", parts[0], parts[1], radius, lat, lng));
            } else {
                queryBuilder.append(String.format("nwr[\"%s\"](around:%f,%f,%f);", tag, radius, lat, lng));
            }
        }
        queryBuilder.append(");out center;");
        return queryBuilder.toString();
    }

    private JsonNode fetchWithRetry(String query, int maxRetries, Long userId) {
        WebClient client = webClientBuilder.baseUrl(OVERPASS_URL).build();

        try {
            return client.post()
                    .bodyValue("data=" + query)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(maxRetries, Duration.ofSeconds(2))
                            .filter(throwable -> isRetryable(throwable))
                            .doBeforeRetry(retrySignal -> 
                                log.warn("🕒 [User: {}] Retrying Overpass call (Attempt {})", userId, retrySignal.totalRetries() + 1))
                    )
                    .map(response -> {
                        try {
                            return objectMapper.readTree(response);
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to parse OSM response", e);
                        }
                    })
                    .block(Duration.ofSeconds(30)); // Safety timeout
        } catch (Exception e) {
            log.error("❌ [User: {}] Overpass API failed after retries: {}", userId, e.getMessage());
            return null;
        }
    }

    private boolean isRetryable(Throwable throwable) {
        // Retry on 429 (Too Many Requests) or server errors (5xx) or timeouts
        if (throwable instanceof org.springframework.web.reactive.function.client.WebClientResponseException ex) {
            return ex.getStatusCode().value() == 429 || ex.getStatusCode().is5xxServerError();
        }
        return throwable instanceof java.util.concurrent.TimeoutException || 
               throwable instanceof org.springframework.web.reactive.function.client.WebClientRequestException;
    }

    private Location mapToLocation(JsonNode element) {
        JsonNode tags = element.get("tags");
        if (tags == null || !tags.has("name")) return null;

        String name = tags.path("name").asText();
        String id = element.path("id").asText();
        // type remains captured in the element but is currently unused for persistence.

        double lat, lon;
        if (element.has("lat") && element.has("lon")) {
            lat = element.get("lat").asDouble();
            lon = element.get("lon").asDouble();
        } else if (element.has("center")) {
            lat = element.get("center").get("lat").asDouble();
            lon = element.get("center").get("lon").asDouble();
        } else {
            return null;
        }

        Location location = new Location();
        location.setName(name);
        location.setExternalId(id);
        location.setSource("OSM");
        location.setLatitude(lat);
        location.setLongitude(lon);
        
        location.setRatingAverage(3.0 + (new Random().nextDouble() * 2.0));
        location.setReviewCount(new Random().nextInt(100));

        String street = tags.path("addr:street").asText("");
        String housenumber = tags.path("addr:housenumber").asText("");
        String city = tags.path("addr:city").asText("");
        
        StringBuilder addr = new StringBuilder();
        if (!housenumber.isEmpty()) addr.append(housenumber).append(" ");
        if (!street.isEmpty()) addr.append(street);
        if (!city.isEmpty()) {
            if (addr.length() > 0) addr.append(", ");
            addr.append(city);
        }
        location.setAddress(addr.length() > 0 ? addr.toString() : "Address N/A");

        location.setPhone(tags.path("phone").asText(tags.path("contact:phone").asText(null)));
        location.setWebsite(tags.path("website").asText(tags.path("contact:website").asText(null)));

        return location;
    }
}