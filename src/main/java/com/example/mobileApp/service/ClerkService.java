package com.example.mobileApp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;
import java.util.List;

@Service
@Slf4j
public class ClerkService {

    @Value("${clerk.secret-key}")
    private String clerkSecretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Fetches details for a specific user from the Clerk Backend API.
     * Documentation: https://clerk.com/docs/reference/backend-api/tag/Users#operation/GetUser
     */
    public Map<String, Object> getUserDetails(String clerkId) {
        String url = "https://api.clerk.com/v1/users/" + clerkId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(clerkSecretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, 
                    HttpMethod.GET, 
                    entity, 
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to fetch user details from Clerk for ID: {}", clerkId, e);
            return null;
        }
    }

    /**
     * Extracts the primary email address from the Clerk User object.
     */
    @SuppressWarnings("unchecked")
    public String getPrimaryEmail(Map<String, Object> clerkUser) {
        if (clerkUser == null) return null;

        List<Map<String, Object>> emailAddresses = (List<Map<String, Object>>) clerkUser.get("email_addresses");
        String primaryEmailId = (String) clerkUser.get("primary_email_address_id");

        if (emailAddresses != null && primaryEmailId != null) {
            return emailAddresses.stream()
                    .filter(e -> primaryEmailId.equals(e.get("id")))
                    .map(e -> (String) e.get("email_address"))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }
}
