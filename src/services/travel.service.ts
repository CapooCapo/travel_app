import { apiRequest } from "../api/client";
import {
  saveOffline,
  getOffline,
  OfflineAttraction,
} from "../storage/offline.storage";
import { Res, PageRes } from "../dto/format";
import { AttractionResponse } from "../dto/discovery/place.DTO";
import {
  ItineraryDTO,
  CreateItineraryRequest,
  AddPlanItemRequest,
} from "../dto/travel/travel.DTO";

// ================== TYPES ==================

export type AttractionSource = "online" | "offline" | "empty";

export interface AttractionsResult {
  data: AttractionResponse[];
  source: AttractionSource;
}

// ================== CONFIG ==================

const DEFAULT_LOCATION = { lat: 10.7769, lng: 106.7009 };

// ================== ATTRACTIONS ==================

/**
 * Lấy danh sách địa điểm lân cận từ API hoặc cache offline nếu lỗi.
 */
export async function getNearbyAttractions(
  lat: number | null,
  lng: number | null
): Promise<AttractionsResult> {
  const resolvedLat = lat ?? DEFAULT_LOCATION.lat;
  const resolvedLng = lng ?? DEFAULT_LOCATION.lng;

  try {
    const res = await apiRequest.getNearbyAttractions(resolvedLat, resolvedLng);
    const attractions = res.data.data.content;

    // Lưu cache offline (ép kiểu nếu cần vì OfflineAttraction có thể khác nhẹ)
    await saveOffline(attractions as unknown as OfflineAttraction[]);

    return { data: attractions, source: "online" };
  } catch (e) {
    console.warn("getNearbyAttractions API failed, falling back to offline:", e);
    const cached = await getOffline();

    if (cached && cached.length > 0) {
      return { data: cached as unknown as AttractionResponse[], source: "offline" };
    }

    return { data: [], source: "empty" };
  }
}

// ================== ITINERARY ==================

/**
 * Service quản lý lịch trình (Itineraries).
 * Tuân thủ Clean Code: Gọi trực tiếp named methods từ apiRequest.
 */
export const travelService = {
  // 🔹 Lấy tất cả lịch trình
  getItineraries: async (): Promise<ItineraryDTO[]> => {
    try {
      const res = await apiRequest.getItineraries();
      return res.data.data;
    } catch (e) {
      console.error("getItineraries error:", e);
      return [];
    }
  },

  // 🔹 Lấy chi tiết một lịch trình
  getItineraryById: async (id: number): Promise<ItineraryDTO | null> => {
    try {
      const res = await apiRequest.getItineraryById(id);
      return res.data.data;
    } catch (e) {
      console.error("getItineraryById error:", e);
      return null;
    }
  },

  // 🔹 Tạo mới lịch trình
  createItinerary: async (
    req: CreateItineraryRequest
  ): Promise<ItineraryDTO> => {
    const res = await apiRequest.createItinerary(req);
    return res.data.data;
  },

  // 🔹 Thêm địa điểm vào lịch trình
  addItineraryItem: async (
    itineraryId: number,
    req: AddPlanItemRequest
  ): Promise<void> => {
    await apiRequest.addItineraryItem(itineraryId, req);
  },

  // 🔹 Xóa địa điểm khỏi lịch trình
  deleteItineraryItem: async (
    itineraryId: number,
    itemId: number
  ): Promise<void> => {
    await apiRequest.deleteItineraryItem(itineraryId, itemId);
  },

  // 🔹 Chia sẻ lịch trình
  shareItinerary: async (id: number): Promise<string> => {
    const res = await apiRequest.shareItinerary(id);
    return res.data.data;
  },
};