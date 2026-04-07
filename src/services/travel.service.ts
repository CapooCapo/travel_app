import { apiRequest } from "../api/client";
import {
  saveOffline,
  getOffline,
  OfflineLocation,
} from "../storage/offline.storage";
import { Res, PageRes } from "../dto/format";
import { LocationResponse } from "../dto/discovery/place.DTO";
import {
  ItineraryDTO,
  CreateItineraryRequest,
  AddPlanItemRequest,
} from "../dto/travel/travel.DTO";

// ================== TYPES ==================

export type LocationSource = "online" | "offline" | "empty";

export interface LocationsResult {
  data: LocationResponse[];
  source: LocationSource;
}

// ================== CONFIG ==================

const DEFAULT_LOCATION = { lat: 10.7769, lng: 106.7009 };

// ================== LOCATIONS ==================

/**
 * Lấy danh sách địa điểm lân cận từ API hoặc cache offline nếu lỗi.
 */
export async function getNearbyLocations(
  lat: number | null,
  lng: number | null
): Promise<LocationsResult> {
  const resolvedLat = lat ?? DEFAULT_LOCATION.lat;
  const resolvedLng = lng ?? DEFAULT_LOCATION.lng;

  try {
    const res = await apiRequest.getNearbyLocations(resolvedLat, resolvedLng);
    const locations = res.data.data.content;

    // Lưu cache offline (ép kiểu nếu cần vì OfflineLocation có thể khác nhẹ)
    await saveOffline(locations as unknown as OfflineLocation[]);

    return { data: locations, source: "online" };
  } catch (e) {
    console.warn("getNearbyLocations API failed, falling back to offline:", e);
    const cached = await getOffline();

    if (cached && cached.length > 0) {
      return { data: cached as unknown as LocationResponse[], source: "offline" };
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