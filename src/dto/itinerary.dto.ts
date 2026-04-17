import { DayPlanDTO } from "./travel/travel.DTO";

export interface ItineraryDTO {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  days: DayPlanDTO[];
  isShared: boolean;
  createdAt: string;
}

export interface CreateItineraryRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

/**
 * Strict DTO for adding an itinerary item.
 * The backend enforces an XOR constraint: exactly one of locationId, eventId, or referenceId must be provided.
 */
export interface AddItineraryItemRequest {
  itineraryId: number;
  type: 'LOCATION' | 'EVENT';
  date: string;
  startDate: string;
  endDate: string;
  
  // Logical XOR group
  locationId?: number;
  eventId?: number;
  referenceId?: number;
  
  startTime?: string;
  endTime?: string;
  note?: string;
  overrideConflict?: boolean;
}

export interface ItineraryItemResponse {
  id: number;
  type: string;
  name: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  note?: string;
  orderIndex: number;
}
