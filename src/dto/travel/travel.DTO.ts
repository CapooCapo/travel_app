import { CreateLocationRequest } from "../discovery/place.DTO";

export type DayPlanItemDTO = {
  id: number;
  type: 'LOCATION' | 'EVENT';
  locationId: number | null;
  eventId: number | null;
  name: string;
  address: string;
  startTime: string | null;
  endTime: string | null;
  note: string | null;
  order: number;
  orderIndex: number;
};

export type DayPlanDTO = {
  date: string;
  items: DayPlanItemDTO[];
};

export type ItineraryDTO = {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  days: DayPlanDTO[];
  isShared: boolean;
  createdAt: string;
};

export type CreateItineraryRequest = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
};

export type AddPlanItemRequest = {
  itineraryId: number;
  date: string;
  type: 'LOCATION' | 'EVENT';
  locationId?: number;
  eventId?: number;
  locationData?: CreateLocationRequest;
  startTime?: string;
  endTime?: string;
  note?: string;
  overrideConflict?: boolean;
};
