export type DayPlanItemDTO = {
  id: number;
  type: 'LOCATION' | 'EVENT';
  referenceId: number;
  name: string;
  address: string;
  startTime?: string;
  endTime?: string;
  note?: string;
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
  date?: string;
  startDate?: string;
  endDate?: string;
  type: 'LOCATION' | 'EVENT';
  locationId?: number;
  eventId?: number;
  referenceId: number;
  startTime?: string;
  endTime?: string;
  note?: string;
};
