import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
import { 
  ItineraryDTO, 
  CreateItineraryRequest, 
  AddPlanItemRequest, 
  DayPlanItemDTO as ItineraryItemResponse 
} from "../dto/travel/travel.DTO";
import { locationService } from "./location.service";

/**
 * Senior Architect Implementation of Itinerary Service.
 * Centralizes payload sanitization to ensure XOR compliance before API calls.
 */
export const itineraryService = {
  
  async getItineraries(): Promise<ItineraryDTO[]> {
    const res = await apiRequest.getItineraries();
    return unwrapResponse(res) || [];
  },

  async loadItineraries(): Promise<ItineraryDTO[]> {
    return this.getItineraries();
  },

  async getItineraryById(id: number): Promise<ItineraryDTO | null> {
    const res = await apiRequest.getItineraryById(id);
    return unwrapResponse(res);
  },

  async createItinerary(req: CreateItineraryRequest): Promise<ItineraryDTO | null> {
    const res = await apiRequest.createItinerary(req);
    return unwrapResponse(res);
  },

  /**
   * Refactored: Implementation of the Sanitization Builder Pattern.
   * Ensures the strict XOR rule (exactly one ID) is respected by pruning identifiers.
   * 🚀 AUTO-SYNC: If locationId is missing but locationData is present, it syncs first.
   */
  async addItem(req: AddPlanItemRequest): Promise<ItineraryItemResponse | null> {
    if (!req.itineraryId) throw new Error("itineraryId is required");

    // 🔄 AUTO-SYNC LOGIC:
    let locationId = req.locationId;
    if (req.type === 'LOCATION' && !locationId && req.locationData) {
      const synced = await locationService.syncLocation(req.locationData);
      if (synced && synced.id) {
        locationId = synced.id;
      } else {
        throw new Error("Failed to synchronize external location");
      }
    }

    // 🧱 Build simplified payload
    const payload: any = {
      type: req.type,
      date: req.date,
      startTime: req.startTime,
      endTime: req.endTime,
      note: req.note,
      overrideConflict: req.overrideConflict
    };

    if (req.type === 'LOCATION') {
      payload.locationId = locationId;
    } else {
      payload.eventId = req.eventId;
    }

    const res = await apiRequest.addItineraryItem(req.itineraryId, payload);
    return unwrapResponse(res);
  },

  async deleteItem(itineraryId: number, itemId: number): Promise<void> {
    const res = await apiRequest.deleteItineraryItem(itineraryId, itemId);
    unwrapResponse(res);
  },

  async deleteItinerary(id: number): Promise<void> {
    const res = await apiRequest.deleteItinerary(id);
    unwrapResponse(res);
  },

  async shareItinerary(id: number): Promise<string | null> {
    const res = await apiRequest.shareItinerary(id);
    return unwrapResponse(res);
  }
};
