import { apiRequest } from "../api/client";
import {
  PlaceDTO,
  mapAttraction,
  AttractionListRequest,
  AttractionResponse,
} from "../dto/discovery/place.DTO";
import { AiRecommendationDTO } from "../dto/ai/ai.DTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const CACHE_KEY = "offline_ai_recommendations";

export const discoveryService = {
  /** GET /api/attractions — search/filter danh sách */
  async getAttractions(
    params: AttractionListRequest,
  ): Promise<{ places: PlaceDTO[]; totalPages: number }> {
    const res = await apiRequest.getAttractions(params);
    const page = res.data?.data;
    // Fix lỗi 'a' implicitly has an 'any' type
    const places = (page?.content ?? []).map((a: AttractionResponse) =>
      mapAttraction(a),
    );
    return { places, totalPages: page?.totalPages ?? 0 };
  },

  async getPopular(page = 0, size = 10): Promise<PlaceDTO[]> {
    const res = await apiRequest.getPopularAttractions(page, size);
    return (res.data?.data?.content ?? []).map((a: AttractionResponse) =>
      mapAttraction(a),
    );
  },

  async getAttractionById(id: number): Promise<PlaceDTO | null> {
    const [attrRes, imgRes] = await Promise.allSettled([
      apiRequest.getAttractionById(id),
      apiRequest.getAttractionImages(id),
    ]);

    if (attrRes.status === "rejected") return null;

    const attraction = attrRes.value.data?.data;
    if (!attraction) return null;

    const images =
      imgRes.status === "fulfilled"
        ? (imgRes.value.data?.data ?? []).map((i: any) => i.imageUrl)
        : [];

    return mapAttraction(attraction, images);
  },

  /** GET /api/attractions/nearby */
  getNearby: async (lat: number, lng: number) => {
    try {
      const res = await apiRequest.getNearbyAttractions(lat, lng);
      return res.data.data.content || [];
    } catch (error) {
      console.error("Discovery Service Error:", error);
      return [];
    }
  },

  /** GET /api/attraction-images/{id}/images */
  async getImages(attractionId: number): Promise<string[]> {
    const res = await apiRequest.getAttractionImages(attractionId);
    return (res.data?.data ?? []).map((i) => i.imageUrl);
  },

  // ─── Bookmarks ──────────────────────────────────────────────────────────

  /** POST /api/bookmarks/{attractionId} */
  async addBookmark(attractionId: number): Promise<void> {
    await apiRequest.addBookmark(attractionId);
  },

  /** DELETE /api/bookmarks/{attractionId} */
  async removeBookmark(attractionId: number): Promise<void> {
    await apiRequest.removeBookmark(attractionId);
  },

  /** GET /api/bookmarks */
  async getBookmarks(): Promise<PlaceDTO[]> {
    const res = await apiRequest.getBookmarks();
    return (res.data?.data ?? []).map((a: AttractionResponse) =>
      mapAttraction(a),
    );
  },

  /** Toggle helper — gọi add hoặc remove tuỳ trạng thái */
  async toggleBookmark(
    attractionId: number,
    currentlyBookmarked: boolean,
  ): Promise<boolean> {
    if (currentlyBookmarked) {
      await apiRequest.removeBookmark(attractionId);
      return false;
    } else {
      await apiRequest.addBookmark(attractionId);
      return true;
    }
  },
  getAiRecommendations: async (lat: number, lng: number) => {
    const netInfo = await NetInfo.fetch();

    // NẾU MẤT MẠNG -> Lấy dữ liệu từ Cache (Offline Mode)
    if (!netInfo.isConnected) {
      console.log("Offline mode: Loading from cache...");
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : [];
    }

    // NẾU CÓ MẠNG -> Gọi API như bình thường
    try {
      // Clear stale cache so old un-enriched data is not reused
      await AsyncStorage.removeItem(CACHE_KEY);

      const res = await apiRequest.getAiRecommendations(lat, lng);
      const data: AiRecommendationDTO[] = res.data?.data || [];
      console.log("[AI] Recommendations count:", data.length);

      // Fetch images for each attraction in parallel
      const enriched = await Promise.all(
        data.map(async (item) => {
          try {
            const imgRes = await apiRequest.getAttractionImages(item.attraction.id);
            // DEBUG: log raw response so we can verify the shape
            console.log(`[IMG] attraction ${item.attraction.id} raw:`, JSON.stringify(imgRes.data));
            const imageList = imgRes.data?.data ?? [];
            const imageUrls = imageList
              .map((i: any) => i.imageUrl ?? i.url ?? i.image ?? null)
              .filter(Boolean) as string[];
            console.log(`[IMG] attraction ${item.attraction.id} urls:`, imageUrls);
            return {
              ...item,
              attraction: { ...item.attraction, imageUrls },
            };
          } catch (imgErr) {
            console.warn(`[IMG] Failed for attraction ${item.attraction.id}:`, imgErr);
            return item; // keep original if image fetch fails
          }
        })
      );

      // LƯU VÀO CACHE cho lần sau (Sync)
      if (enriched.length > 0) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(enriched));
      }

      return enriched;
    } catch (error) {
      console.error("Lỗi gọi AI Recommend API:", error);
      // Fallback: Lỗi API thì vẫn thử lấy cache cũ
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : [];
    }
  },
};
