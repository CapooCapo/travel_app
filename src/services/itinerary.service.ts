import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
import { 
  ItineraryDTO, 
  CreateItineraryRequest, 
  AddItineraryItemRequest, 
  ItineraryItemResponse 
} from "../dto/itinerary.dto";

/**
 * Senior Architect Implementation of Itinerary Service.
 * Centralizes payload sanitization to ensure XOR compliance before API calls.
 */
export const itineraryService = {
  
  async getItineraries(): Promise<ItineraryDTO[]> {
    const res = await apiRequest.getItineraries();
    return unwrapResponse(res) || [];
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
   */
  async addItem(req: AddItineraryItemRequest): Promise<ItineraryItemResponse | null> {
    // 🧱 Build sanitized payload
    const payload = { ...req };
    
    // 🛡️ XOR Sanitization Rule:
    // If we have a system locationId, we MUST NOT send referenceId or eventId.
    // If we have an eventId, we MUST NOT send locationId or referenceId.
    // This complies with backend constraint: itinerary_items_strict_xor_check
    if (payload.locationId) {
      console.log(`[ItineraryService] Sanitizing for locationId: ${payload.locationId}`);
      delete payload.referenceId;
      delete payload.eventId;
    } else if (payload.eventId) {
      console.log(`[ItineraryService] Sanitizing for eventId: ${payload.eventId}`);
      delete payload.locationId;
      delete payload.referenceId;
    } else if (payload.referenceId) {
      console.log(`[ItineraryService] Sanitizing for referenceId: ${payload.referenceId}`);
      delete payload.locationId;
      delete payload.eventId;
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
