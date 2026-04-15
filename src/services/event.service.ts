import { eventApi } from "../api/event.api";
import { unwrapResponse } from "../utils/responseHandler";
import { EventFilterParams, EventCreateRequest } from "../dto/event/event.DTO";

export const eventService = {
  async getEvents(params: EventFilterParams) {
    const res = await eventApi.getEvents(params);
    return unwrapResponse(res);
  },

  async getEventById(id: number) {
    const res = await eventApi.getEventById(id);
    return unwrapResponse(res);
  },

  async createEvent(req: EventCreateRequest) {
    const res = await eventApi.createEvent(req);
    return unwrapResponse(res);
  },

  async updateEvent(id: number, req: EventCreateRequest) {
    const res = await eventApi.updateEvent(id, req);
    return unwrapResponse(res);
  },

  async deleteEvent(id: number) {
    const res = await eventApi.deleteEvent(id);
    return unwrapResponse(res);
  },

  async getMyEvents() {
    const res = await eventApi.getMyEvents();
    return unwrapResponse(res);
  },

  // Bookmarks
  async bookmarkEvent(id: number) {
    const res = await eventApi.bookmarkEvent(id);
    return unwrapResponse(res);
  },

  async unbookmarkEvent(id: number) {
    const res = await eventApi.unbookmarkEvent(id);
    return unwrapResponse(res);
  },

  async getMyBookmarks(page = 0, size = 10) {
    const res = await eventApi.getMyBookmarks(page, size);
    return unwrapResponse(res);
  },

  async getBookmarkedIds() {
    const res = await eventApi.getBookmarkedIds();
    return unwrapResponse(res);
  },

  async getEventsByLocation(locationId: number, pageNum = 0, pageSize = 10) {
    const res = await eventApi.getEventsByLocation(locationId, pageNum, pageSize);
    return unwrapResponse(res);
  },

  async getCategories() {
    const res = await eventApi.getCategories();
    return unwrapResponse(res);
  }
};
