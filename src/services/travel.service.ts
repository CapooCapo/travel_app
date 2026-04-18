import { apiRequest } from "../api/client";
import {
  saveOffline,
  getOffline,
  OfflineLocation,
} from "../storage/offline.storage";
import { Res, PageRes } from "../dto/format";
import { LocationResponse } from "../dto/discovery/place.DTO";
import { unwrapResponse } from "../utils/responseHandler";
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
    const pageData = unwrapResponse(res);
    const locations = pageData?.content || [];

    // Lưu cache offline
    if (locations.length > 0) {
      await saveOffline(locations as unknown as OfflineLocation[]);
    }

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
      return unwrapResponse(res) || [];
    } catch (e) {
      console.error("getItineraries error:", e);
      return [];
    }
  },

  loadItineraries: async function(): Promise<ItineraryDTO[]> {
    return this.getItineraries();
  },

  // 🔹 Lấy chi tiết một lịch trình
  getItineraryById: async (id: number): Promise<ItineraryDTO | null> => {
    try {
      const res = await apiRequest.getItineraryById(id);
      return unwrapResponse(res);
    } catch (e) {
      console.error("getItineraryById error:", e);
      return null;
    }
  },

  createItinerary: async (
    req: CreateItineraryRequest
  ): Promise<ItineraryDTO | null> => {
    try {
      const res = await apiRequest.createItinerary(req);
      return unwrapResponse(res);
    } catch (e) {
      console.error("createItinerary error:", e);
      return null;
    }
  },

  addItineraryItem: async (
    itineraryId: number,
    req: AddPlanItemRequest
  ): Promise<void> => {
    try {
      // 🛡️ Pre-flight Payload Sanitization
      // The database enforces a strict XOR constraint (only ONE type of ID allowed).
      const sanitizedReq = { ...req };
      if (sanitizedReq.locationId) {
        delete (sanitizedReq as any).eventId;
      } else if (sanitizedReq.eventId) {
        delete (sanitizedReq as any).locationId;
      }

      const res = await apiRequest.addItineraryItem(itineraryId, sanitizedReq);
      unwrapResponse(res);
    } catch (e) {
      console.error("addItineraryItem error:", e);
      throw e;
    }
  },

  deleteItineraryItem: async (
    itineraryId: number,
    itemId: number
  ): Promise<void> => {
    try {
      const res = await apiRequest.deleteItineraryItem(itineraryId, itemId);
      unwrapResponse(res);
    } catch (e) {
      console.error("deleteItineraryItem error:", e);
      throw e;
    }
  },

  deleteItinerary: async (id: number): Promise<void> => {
    try {
      const res = await apiRequest.deleteItinerary(id);
      unwrapResponse(res);
    } catch (e) {
      console.error("deleteItinerary error:", e);
      throw e;
    }
  },

  shareItinerary: async (id: number): Promise<string | null> => {
    try {
      const res = await apiRequest.shareItinerary(id);
      return unwrapResponse(res);
    } catch (e) {
      console.error("shareItinerary error:", e);
      return null;
    }
  },

  updateItineraryDescription: async (id: number, description: string): Promise<void> => {
    try {
      const res = await apiRequest.updateItineraryDescription(id, description);
      unwrapResponse(res);
    } catch (e) {
      console.error("updateItineraryDescription error:", e);
      throw e;
    }
  },
};