export type TravelScheduleDTO = {
  id: number;
  locationId: number;
  locationName: string;
  scheduledDate: string;
  notes?: string;
};

export type CreateTravelScheduleRequest = {
  locationId: number;
  scheduledDate: string;
  notes?: string;
};
