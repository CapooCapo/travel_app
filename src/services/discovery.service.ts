import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
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
      const page = unwrapResponse(await apiRequest.getLocations(params));
      const places = (page?.content ?? []).map((a: LocationResponse) => mapLocation(a));
      return { places, totalPages: page?.totalPages ?? 0 };
    } catch (e) {
      console.error("[DiscoveryService] getLocations error:", e);
      return { places: [], totalPages: 0 };
    }
  },

  async getPopular(page = 0, size = 10): Promise<PlaceDTO[]> {
    try {
      const data = unwrapResponse(await apiRequest.getPopularLocations(page, size));
      return (data?.content ?? []).map((a: LocationResponse) => mapLocation(a));
    } catch (e) {
      console.error("[DiscoveryService] getPopular error:", e);
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

      const location = unwrapResponse(attrRes.value);
      if (!location) return null;

      let images: string[] = [];
      if (imgRes.status === "fulfilled") {
        const iData = unwrapResponse(imgRes.value);
        images = (iData ?? []).map((i: any) => i.imageUrl);
      }

      return mapLocation(location, images);
    } catch (e) {
      console.error("[DiscoveryService] getLocationById error:", e);
      return null;
    }
  },

  async getNearby(lat: number, lng: number): Promise<PlaceDTO[]> {
    try {
      const data = unwrapResponse(await apiRequest.getNearbyLocations(lat, lng));
      return (data?.content || []).map((a: any) => mapLocation(a));
    } catch (error) {
      console.error("[DiscoveryService] getNearby error:", error);
      return [];
    }
  },

  /** GET /api/location-images/{id}/images */
  async getImages(locationId: number): Promise<string[]> {
    try {
      const images = unwrapResponse(await apiRequest.getLocationImages(locationId));
      return (images ?? []).map((i: any) => i.imageUrl);
    } catch (e) {
      console.error("[DiscoveryService] getImages error:", e);
      return [];
    }
  },

  // ─── Bookmarks ──────────────────────────────────────────────────────────

  async addBookmark(locationId: number): Promise<void> {
    const res = await apiRequest.addBookmark(locationId);
    unwrapResponse(res);
  },

  async removeBookmark(locationId: number): Promise<void> {
    const res = await apiRequest.removeBookmark(locationId);
    unwrapResponse(res);
  },

  async getBookmarks(): Promise<PlaceDTO[]> {
    try {
      const list = unwrapResponse(await apiRequest.getBookmarks());
      return (list ?? []).map((a: LocationResponse) => mapLocation(a));
    } catch (e) {
      console.error("[DiscoveryService] getBookmarks error:", e);
      return [];
    }
  },

  async toggleBookmark(
    locationId: number,
    currentlyBookmarked: boolean,
  ): Promise<boolean> {
    if (currentlyBookmarked) {
      await this.removeBookmark(locationId);
      return false;
    } else {
      await this.addBookmark(locationId);
      return true;
    }
  },

  async getAiRecommendations(lat: number, lng: number, userId: number): Promise<AiRecommendationDTO[]> {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      return this.getCachedRecommendations();
    }

    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      const data = unwrapResponse(await apiRequest.getAiRecommendations(lat, lng, userId));
      
      const recommendations: AiRecommendationDTO[] = data || [];
      if (recommendations.length === 0) return [];

      const enriched = await this.enrichWithImages(recommendations);
      await this.saveToCache(enriched);
      return enriched;

    } catch (error) {
      console.error("[DiscoveryService] getAiRecommendations error:", error);
      return this.getCachedRecommendations();
    }
  },

  async enrichWithImages(data: AiRecommendationDTO[]): Promise<AiRecommendationDTO[]> {
    return Promise.all(
      data.map(async (item) => {
        try {
          const imageList = unwrapResponse(await apiRequest.getLocationImages(item.locationId));
          const imageUrls = (imageList || [])
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
      const page = unwrapResponse(await apiRequest.searchLocations(keyword));
      return (page?.content ?? []).map((a: LocationResponse) => mapLocation(a));
    } catch (e) {
      console.error("[DiscoveryService] searchLocations error:", e);
      return [];
    }
  },
};
