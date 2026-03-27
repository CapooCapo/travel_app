export type DayPlanItemDTO = {
  id: number;
  type: 'place' | 'event';
  referenceId: number;
  name: string;
  address: string;
  startTime?: string;
  note?: string;
  order: number;
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
  type: 'place' | 'event';
  referenceId: number;
  startTime?: string;
  note?: string;
};
