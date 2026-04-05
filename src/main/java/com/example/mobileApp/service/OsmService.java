package com.example.mobileApp.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.mobileApp.entity.Location;
import com.example.mobileApp.entity.LocationImage;
import com.example.mobileApp.repository.LocationImageRepository;
import com.example.mobileApp.repository.LocationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OsmService {

    private final LocationRepository locationRepository;
    private final LocationImageRepository imageRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final Random random = new Random();

    private final List<String> sampleImages = Arrays.asList(
        "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=500"
    );

    // ✅ thread-safe
    private final Map<String, Long> fetchCache = new ConcurrentHashMap<>();
    private static final long CACHE_TIME = 60 * 60 * 1000; // 1h

    public OsmService(LocationRepository locationRepository,
                      LocationImageRepository imageRepository) {
        this.locationRepository = locationRepository;
        this.imageRepository = imageRepository;
    }

    @Async("taskExecutor")
    public CompletableFuture<Void> fetchAndSaveNearbyPlacesAsync(Double lat, Double lng) {

        String key = Math.round(lat * 1000) + "_" + Math.round(lng * 1000);
        long now = System.currentTimeMillis();

        // ✅ CHECK CACHE NGAY
        Long lastFetch = fetchCache.get(key);
        if (lastFetch != null && now - lastFetch < CACHE_TIME) {
            System.out.println("⚠️ OSM CACHE HIT");
            return CompletableFuture.completedFuture(null);
        }

        try {
            fetchFromOSM(lat, lng);
            fetchCache.put(key, now);
            System.out.println("✔ OSM fetch OK");
        } catch (Exception e) {
            System.err.println("❌ OSM error: " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    private void fetchFromOSM(Double lat, Double lng) throws Exception {

        String query = String.format(
            "[out:json];(" +
            "node[\"tourism\"~\"attraction|museum|viewpoint\"](around:3000,%s,%s);" +
            "node[\"amenity\"=\"restaurant\"](around:3000,%s,%s);" +
            ");out;", lat, lng, lat, lng
        );

        String url = "https://overpass-api.de/api/interpreter?data=" + query;

        String response = restTemplate.getForObject(url, String.class);
        JsonNode elements = mapper.readTree(response).path("elements");

        for (JsonNode node : elements) {

            String name = node.path("tags").path("name").asText(null);
            if (name == null || name.length() < 3) continue;
            if (!node.has("lat") || !node.has("lon")) continue;

            String externalId = String.valueOf(node.get("id").asLong());
            if (locationRepository.existsByExternalIdAndSource(externalId, "OSM")) continue;

            Location location = new Location();
            location.setName(name);
            location.setAddress(node.path("tags").path("addr:full").asText("Việt Nam"));
            location.setLatitude(node.get("lat").asDouble());
            location.setLongitude(node.get("lon").asDouble());
            location.setSource("OSM");
            location.setExternalId(externalId);
            location.setRatingAverage(0.0);
            location.setReviewCount(0);

            Location saved = locationRepository.save(location);

            LocationImage img = new LocationImage();
            img.setImageUrl(sampleImages.get(random.nextInt(sampleImages.size())));
            img.setLocation(saved);

            imageRepository.save(img);
        }
    }
}