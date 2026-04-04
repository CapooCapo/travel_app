export type DayPlanItemDTO = {
  id: number;
  type: 'PLACE' | 'EVENT';
  referenceId: number;
  name: string;
  address: string;
  imageUrl?: string;
  startTime?: string;   // "HH:mm"
  endTime?: string;     // "HH:mm"
  note?: string;
  orderIndex: number;
};

export type DayPlanDTO = {
  date: string; // "YYYY-MM-DD"
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
  date: string;
  type: 'PLACE' | 'EVENT';
  referenceId: number;
  startTime?: string;
  endTime?: string;
  note?: string;
};
