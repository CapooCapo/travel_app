import http from "../utils/http";
import { Res } from "../dto/format";
import {
  ItineraryDTO,
  CreateItineraryRequest,
  AddPlanItemRequest,
} from "../dto/travel/travel.DTO";
import {
  TravelScheduleDTO,
  CreateTravelScheduleRequest,
} from "../dto/schedule/schedule.DTO";

export const travelApi = {
  getItineraries() {
    return http.get<Res<ItineraryDTO[]>>("/api/itineraries");
  },
  getItineraryById(id: number) {
    return http.get<Res<ItineraryDTO>>(`/api/itineraries/${id}`);
  },
  createItinerary(req: CreateItineraryRequest) {
    return http.post<Res<ItineraryDTO>>("/api/itineraries", req);
  },
  addItineraryItem(itineraryId: number, req: AddPlanItemRequest) {
    return http.post<Res<null>>(`/api/itineraries/${itineraryId}/items`, req);
  },
  deleteItineraryItem(itineraryId: number, itemId: number) {
    return http.delete<Res<null>>(`/api/itineraries/${itineraryId}/items/${itemId}`);
  },
  shareItinerary(id: number) {
    return http.post<Res<string>>(`/api/itineraries/${id}/share`);
  },
  updateItineraryNotes(id: number, notes: string) {
    return http.put<Res<null>>(`/api/itineraries/${id}/notes`, { notes });
  },
  getSchedules() {
    return http.get<Res<TravelScheduleDTO[]>>("/api/schedules");
  },
  createSchedule(req: CreateTravelScheduleRequest) {
    return http.post<Res<TravelScheduleDTO>>("/api/schedules", req);
  },
  updateSchedule(id: number, req: CreateTravelScheduleRequest) {
    return http.put<Res<TravelScheduleDTO>>(`/api/schedules/${id}`, req);
  },
  deleteSchedule(id: number) {
    return http.delete<Res<null>>(`/api/schedules/${id}`);
  },
  getCalendar() {
    return http.get<Res<any[]>>("/api/calendar");
  },
};
