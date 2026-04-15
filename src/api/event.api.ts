import http from "../utils/http";
import { Res, PageRes } from "../dto/format";
import { EventResponse, EventFilterParams, EventCreateRequest } from "../dto/event/event.DTO";

export const eventApi = {
  getEvents(params: EventFilterParams = {}) {
    return http.get<Res<PageRes<EventResponse>>>("/api/events", { params })
      .then(res => res.data);
  },

  getEventById(id: number) {
    return http.get<Res<EventResponse>>(`/api/events/${id}`)
      .then(res => res.data);
  },

  createEvent(req: EventCreateRequest) {
    return http.post<Res<EventResponse>>("/api/events", req)
      .then(res => res.data);
  },

  updateEvent(id: number, req: EventCreateRequest) {
    return http.put<Res<EventResponse>>(`/api/events/${id}`, req)
      .then(res => res.data);
  },

  deleteEvent(id: number) {
    return http.delete<Res<void>>(`/api/events/${id}`)
      .then(res => res.data);
  },

  getMyEvents() {
    return http.get<Res<EventResponse[]>>("/api/events/me")
      .then(res => res.data);
  },

  // Bookmarks
  bookmarkEvent(id: number) {
    return http.post<Res<void>>(`/api/events/${id}/bookmark`)
      .then(res => res.data);
  },

  unbookmarkEvent(id: number) {
    return http.delete<Res<void>>(`/api/events/${id}/bookmark`)
      .then(res => res.data);
  },

  getMyBookmarks(page = 0, size = 10) {
    return http.get<Res<PageRes<EventResponse>>>("/api/events/me/bookmarks", { params: { page, size } })
      .then(res => res.data);
  },

  getBookmarkedIds() {
    return http.get<Res<number[]>>("/api/events/me/bookmarked-ids")
      .then(res => res.data);
  },

  getCategories() {
    return http.get<Res<{id: number, name: string}[]>>("/api/categories")
      .then(res => res.data);
  },

  getEventsByLocation(locationId: number, pageNum = 0, pageSize = 10) {
    return http.get<Res<PageRes<EventResponse>>>(`/api/events/location/${locationId}`, { 
      params: { page: pageNum, size: pageSize } 
    }).then(res => res.data);
  }
};
