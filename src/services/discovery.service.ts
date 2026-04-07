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
    const res = await apiRequest.getLocations(params);
    const page = res.data?.data;
    // Fix lỗi 'a' implicitly has an 'any' type
    const places = (page?.content ?? []).map((a: LocationResponse) =>
      mapLocation(a),
    );
    return { places, totalPages: page?.totalPages ?? 0 };
  },

  async getPopular(page = 0, size = 10): Promise<PlaceDTO[]> {
    const res = await apiRequest.getPopularLocations(page, size);
    return (res.data?.data?.content ?? []).map((a: LocationResponse) =>
      mapLocation(a),
    );
  },

  async getLocationById(id: number): Promise<PlaceDTO | null> {
    const [attrRes, imgRes] = await Promise.allSettled([
      apiRequest.getLocationById(id),
      apiRequest.getLocationImages(id),
    ]);

    if (attrRes.status === "rejected") return null;

    const location = attrRes.value.data?.data;
    if (!location) return null;

    const images =
      imgRes.status === "fulfilled"
        ? (imgRes.value.data?.data ?? []).map((i: any) => i.imageUrl)
        : [];

    return mapLocation(location, images);
  },

  /** GET /api/locations/nearby */
  getNearby: async (lat: number, lng: number) => {
    try {
      const res = await apiRequest.getNearbyLocations(lat, lng);
      return res.data.data.content || [];
    } catch (error) {
      console.error("Discovery Service Error:", error);
      return [];
    }
  },

  /** GET /api/location-images/{id}/images */
  async getImages(locationId: number): Promise<string[]> {
    const res = await apiRequest.getLocationImages(locationId);
    return (res.data?.data ?? []).map((i) => i.imageUrl);
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
    const res = await apiRequest.getBookmarks();
    return (res.data?.data ?? []).map((a: LocationResponse) =>
      mapLocation(a),
    );
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
      const res = await apiRequest.getAiRecommendations(lat, lng, userId);
      const data: AiRecommendationDTO[] = res.data?.data || [];
      
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
          const imgRes = await apiRequest.getLocationImages(item.locationId);
          const imageList = imgRes.data?.data ?? [];
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
};
