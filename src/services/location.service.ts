import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
import { 
  LocationResponse, 
  CreateLocationRequest 
} from "../dto/discovery/place.DTO";

/**
 * Service for managing Locations and high-level sync logic.
 */
export const locationService = {
  
  /**
   * Synchronizes an external location with the local database.
   * Ensures we have a valid internal DB ID before adding to itineraries.
   */
  async syncLocation(req: CreateLocationRequest): Promise<LocationResponse | null> {
    try {
      const res = await apiRequest.createLocation(req);
      return unwrapResponse(res);
    } catch (e) {
      console.error("syncLocation failed:", e);
      throw e;
    }
  },

  async getLocationById(id: number): Promise<LocationResponse | null> {
    const res = await apiRequest.getLocationById(id);
    return unwrapResponse(res);
  }
};
