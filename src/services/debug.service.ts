import { discoveryService } from "./discovery.service";
import { socialService as userService } from "./social.service";

/**
 * Service for managing full-stack debug sessions and test triggers.
 * Used internally to verify API integrity and payload matching.
 */
export const debugService = {
  /**
   * Triggers the User Search test sequence.
   * Path: [POST /api/users/search]
   */
  async runUserSearchTests() {
    const queries = ["gia", "giah", "giahoang21205@gmail.com"];
    console.log("[FE DEBUG] Starting User Search Test Sequence...");
    
    for (const query of queries) {
      try {
        await userService.searchUsers(query, 10, 0);
      } catch (err) {
        // Interceptor handles logging; we just prevent the loop from breaking
      }
    }
    console.log("[FE DEBUG] User Search Test Sequence Complete.");
  },

  /**
   * Triggers the AI Recommendation test sequence.
   * Path: [POST /api/locations/ai-recommend]
   */
  async runAiRecommendationTest() {
    console.log("[FE DEBUG] Starting AI Recommendation Test...");
    try {
      await discoveryService.getAiRecommendations(10.8461421, 106.6550293, 1);
    } catch (err) {
      // Interceptor handles logging
    }
    console.log("[FE DEBUG] AI Recommendation Test Complete.");
  },

  /**
   * Triggers the User Profile test sequence.
   * Path: [GET /api/users/{userId}]
   */
  async runUserProfileTest(userId: number) {
    console.log(`[FE DEBUG] Starting User Profile Test for userId: ${userId}`);
    
    // Simulating the log chain from FeedItem discovery
    console.log(`[SearchItem] clicked userId: ${userId}`);
    
    // Simulating the navigation and screen initialization
    console.log(`[UserProfileScreen] Route params userId: ${userId}`);
    console.log(`[UserProfileScreen] Fetching profile for userId: ${userId}`);
    
    try {
      await userService.getUserProfile(userId);
    } catch (err) {
      // Interceptor handles logging
    }
    
    console.log("[FE DEBUG] User Profile Test Complete.");
  }
};
