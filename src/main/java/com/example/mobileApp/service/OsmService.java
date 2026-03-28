package com.example.mobileApp.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.mobileApp.entity.Attraction;
import com.example.mobileApp.entity.AttractionImage; // Thêm import này
import com.example.mobileApp.entity.Event;
import com.example.mobileApp.repository.AttractionImageRepository;
import com.example.mobileApp.repository.AttractionRepository;
import com.example.mobileApp.repository.EventRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OsmService {

    private final AttractionRepository attractionRepository;
    private final EventRepository eventRepository;
    private final AttractionImageRepository imageRepository; // 1. Khai báo thêm
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // 2. Sửa Constructor để Inject cả 3 Repository vào
    public OsmService(
        AttractionRepository attractionRepository, 
        EventRepository eventRepository, 
        AttractionImageRepository imageRepository
    ) {
        this.attractionRepository = attractionRepository;
        this.eventRepository = eventRepository;
        this.imageRepository = imageRepository;
    }

    public void fetchAndSaveNearbyPlaces(Double lat, Double lng) {
        String query = String.format("[out:json];node[\"tourism\"](around:3000,%s,%s);out;", lat, lng);
        String url = "https://overpass-api.de/api/interpreter?data=" + query;

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode elements = mapper.readTree(response).path("elements");

            for (JsonNode node : elements) {
                String name = node.path("tags").path("name").asText();
                if (name.isEmpty()) continue;

                if (!attractionRepository.existsByName(name)) {
                    // Tạo Location
                    Attraction attr = new Attraction();
                    attr.setName(name);
                    attr.setAddress(node.path("tags").path("addr:full").asText("TP. Hồ Chí Minh"));
                    attr.setLatitude(node.path("lat").asDouble());
                    attr.setLongitude(node.path("lon").asDouble());
                    attr.setRatingAverage(4.0 + (Math.random() * 1.0));
                    attr.setReviewCount((int) (Math.random() * 100));

                    Attraction savedAttr = attractionRepository.save(attr);

                    // 3. Bây giờ imageRepository đã tồn tại và dùng được
                    AttractionImage img = new AttractionImage();
                    img.setImageUrl("https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500"); // Link ảnh mẫu tĩnh cho ổn định
                    img.setAttraction(savedAttr);
                    imageRepository.save(img);

                    // 4. eventRepository cũng đã được khởi tạo
                    Event event = new Event();
                    event.setName("Sự kiện tại " + name);
                    event.setDescription("Khám phá văn hóa và du lịch địa phương.");
                    event.setEventDate(LocalDateTime.now().plusDays(7));
                    event.setAttraction(savedAttr);
                    eventRepository.save(event);
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi quét OSM: " + e.getMessage());
        }
    }
}