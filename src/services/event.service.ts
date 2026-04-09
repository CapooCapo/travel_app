import { eventApi } from "../api/event.api";
import { EventResponse, EventFilterParams, EventCreateRequest } from "../dto/event/event.DTO";

export const eventService = {
  async getEvents(params: EventFilterParams) {
    const res = await eventApi.getEvents(params);
    return res;
  },

  async getEventById(id: number) {
    return await eventApi.getEventById(id);
  },

  async createEvent(req: EventCreateRequest) {
    return await eventApi.createEvent(req);
  },

  async updateEvent(id: number, req: EventCreateRequest) {
    return await eventApi.updateEvent(id, req);
  },

  async deleteEvent(id: number) {
    return await eventApi.deleteEvent(id);
  },

  async getMyEvents() {
    return await eventApi.getMyEvents();
  },

  // Bookmarks
  async bookmarkEvent(id: number) {
    return await eventApi.bookmarkEvent(id);
  },

  async unbookmarkEvent(id: number) {
    return await eventApi.unbookmarkEvent(id);
  },

  async getMyBookmarks(page = 0, size = 10) {
    return await eventApi.getMyBookmarks(page, size);
  },

  async getBookmarkedIds() {
    return await eventApi.getBookmarkedIds();
  },

  async getEventsByLocation(locationId: number, pageNum = 0, pageSize = 10) {
    return await eventApi.getEventsByLocation(locationId, pageNum, pageSize);
  },

  async getCategories() {
    return await eventApi.getCategories();
  }
};
