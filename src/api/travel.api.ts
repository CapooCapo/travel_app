import http from "../utils/http";
import { Res } from "../dto/format";
import {
  ItineraryDTO,
  CreateItineraryRequest,
} from "../dto/travel/travel.DTO";
import { AddItineraryItemRequest } from "../dto/itinerary.dto";
import {
  TravelScheduleDTO,
  CreateTravelScheduleRequest,
} from "../dto/schedule/schedule.DTO";

export const travelApi = {
  getItineraries() {
    return http.get<Res<ItineraryDTO[]>>("/api/itineraries").then(res => res.data);
  },
  getItineraryById(id: number) {
    return http.get<Res<ItineraryDTO>>(`/api/itineraries/${id}`).then(res => res.data);
  },
  createItinerary(req: CreateItineraryRequest) {
    return http.post<Res<ItineraryDTO>>("/api/itineraries", req).then(res => res.data);
  },
  addItineraryItem(itineraryId: number, req: AddItineraryItemRequest) {
    return http.post<Res<null>>(`/api/itineraries/${itineraryId}/items`, req).then(res => res.data);
  },
  deleteItineraryItem(itineraryId: number, itemId: number) {
    return http.delete<Res<null>>(`/api/itineraries/${itineraryId}/items/${itemId}`).then(res => res.data);
  },
  deleteItinerary(id: number) {
    return http.delete<Res<null>>(`/api/itineraries/${id}`).then(res => res.data);
  },
  shareItinerary(id: number) {
    return http.post<Res<string>>(`/api/itineraries/${id}/share`).then(res => res.data);
  },
  updateItineraryDescription(id: number, description: string) {
    return http.put<Res<null>>(`/api/itineraries/${id}/description`, { description }).then(res => res.data);
  },
  getSchedules() {
    return http.get<Res<TravelScheduleDTO[]>>("/api/schedules").then(res => res.data);
  },
  createSchedule(req: CreateTravelScheduleRequest) {
    return http.post<Res<TravelScheduleDTO>>("/api/schedules", req).then(res => res.data);
  },
  updateSchedule(id: number, req: CreateTravelScheduleRequest) {
    return http.put<Res<TravelScheduleDTO>>(`/api/schedules/${id}`, req).then(res => res.data);
  },
  deleteSchedule(id: number) {
    return http.delete<Res<null>>(`/api/schedules/${id}`).then(res => res.data);
  },
  getCalendar() {
    return http.get<Res<any[]>>("/api/calendar").then(res => res.data);
  },
};
