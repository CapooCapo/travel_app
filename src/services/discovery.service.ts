import { apiRequest } from "../api/client";
import {
  PlaceDTO,
  mapLocation,
  LocationListRequest,
  LocationResponse,
} from "../dto/discovery/place.DTO";
import { AiRecommendationDTO } from "../dto/ai/ai.DTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const CACHE_KEY = "offline_ai_recommendations";

export const discoveryService = {
  /** GET /api/locations — search/filter danh sách */
  async getLocations(
    params: LocationListRequest,
  ): Promise<{ places: PlaceDTO[]; totalPages: number }> {
    try {
      const page = await apiRequest.getLocations(params);
      const places = (page?.content ?? []).map((a: LocationResponse) => mapLocation(a));
      return { places, totalPages: page?.totalPages ?? 0 };
    } catch (e) {
      console.error("getLocations error:", e);
      return { places: [], totalPages: 0 };
    }
  },

  async getPopular(page = 0, size = 10): Promise<PlaceDTO[]> {
    try {
      const data = await apiRequest.getPopularLocations(page, size);
      return (data?.content ?? []).map((a: LocationResponse) => mapLocation(a));
    } catch (e) {
      console.error("getPopular error:", e);
      return [];
    }
  },

  async getLocationById(id: number): Promise<PlaceDTO | null> {
    try {
      const [attrRes, imgRes] = await Promise.allSettled([
        apiRequest.getLocationById(id),
        apiRequest.getLocationImages(id),
      ]);

      if (attrRes.status === "rejected") return null;

      const location = attrRes.value;
      if (!location) return null;

      const images =
        imgRes.status === "fulfilled"
          ? (imgRes.value ?? []).map((i: any) => i.imageUrl)
          : [];

      return mapLocation(location, images);
    } catch (e) {
      console.error("getLocationById error:", e);
      return null;
    }
  },

  getNearby: async (lat: number, lng: number) => {
    try {
      const data = await apiRequest.getNearbyLocations(lat, lng);
      return data?.content || [];
    } catch (error) {
      console.error("Discovery Service Error:", error);
      return [];
    }
  },

  /** GET /api/location-images/{id}/images */
  async getImages(locationId: number): Promise<string[]> {
    try {
      const images = await apiRequest.getLocationImages(locationId);
      return (images ?? []).map((i) => i.imageUrl);
    } catch (e) {
      console.error("getImages error:", e);
      return [];
    }
  },

  // ─── Bookmarks ──────────────────────────────────────────────────────────

  /** POST /api/bookmarks/{locationId} */
  async addBookmark(locationId: number): Promise<void> {
    await apiRequest.addBookmark(locationId);
  },

  /** DELETE /api/bookmarks/{locationId} */
  async removeBookmark(locationId: number): Promise<void> {
    await apiRequest.removeBookmark(locationId);
  },

  /** GET /api/bookmarks */
  async getBookmarks(): Promise<PlaceDTO[]> {
    try {
      const list = await apiRequest.getBookmarks();
      return (list ?? []).map((a: LocationResponse) => mapLocation(a));
    } catch (e) {
      console.error("getBookmarks error:", e);
      return [];
    }
  },

  /** Toggle helper — gọi add hoặc remove tuỳ trạng thái */
  async toggleBookmark(
    locationId: number,
    currentlyBookmarked: boolean,
  ): Promise<boolean> {
    if (currentlyBookmarked) {
      await apiRequest.removeBookmark(locationId);
      return false;
    } else {
      await apiRequest.addBookmark(locationId);
      return true;
    }
  },
  /** 
   * POST /api/locations/ai-recommend
   * Handles AI-based recommendations with offline caching and image enrichment.
   */
  async getAiRecommendations(lat: number, lng: number, userId: number): Promise<AiRecommendationDTO[]> {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      return this.getCachedRecommendations();
    }

    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      const data: AiRecommendationDTO[] = await apiRequest.getAiRecommendations(lat, lng, userId) || [];
      
      if (data.length === 0) return [];

      const enriched = await this.enrichWithImages(data);
      await this.saveToCache(enriched);
      return enriched;

    } catch (error) {
      return this.getCachedRecommendations();
    }
  },

  /** Helper to fetch images for recommendation items in parallel */
  async enrichWithImages(data: AiRecommendationDTO[]): Promise<AiRecommendationDTO[]> {
    return Promise.all(
      data.map(async (item) => {
        try {
          const imageList = await apiRequest.getLocationImages(item.locationId) || [];
          const imageUrls = imageList
            .map((i: any) => i.imageUrl ?? i.url ?? i.image ?? null)
            .filter(Boolean) as string[];
          
          return { ...item, imageUrls };
        } catch (imgErr) {
          return item;
        }
      })
    );
  },

  async getCachedRecommendations(): Promise<AiRecommendationDTO[]> {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  },

  async saveToCache(data: AiRecommendationDTO[]): Promise<void> {
    if (data.length > 0) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }
  },

  async searchLocations(keyword: string): Promise<PlaceDTO[]> {
    try {
      const page = await apiRequest.searchLocations(keyword);
      return (page?.content ?? []).map((a: LocationResponse) => mapLocation(a));
    } catch (e) {
      console.error("searchLocations error:", e);
      return [];
    }
  },
};
