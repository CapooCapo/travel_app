import { apiRequest } from "../api/client";
import { CreateItineraryRequest, AddPlanItemRequest } from "../dto/travel/travel.DTO";

export const travelService = {
  async getItineraries() {
    const res = await apiRequest.getItineraries();
    if (res.status !== 200) throw new Error(res.data.message || "Failed to fetch itineraries");
    return res.data.data;
  },

  async getItineraryById(id: number) {
    const res = await apiRequest.getItineraryById(id);
    if (res.status !== 200) throw new Error(res.data.message || "Itinerary not found");
    return res.data.data;
  },

  async createItinerary(req: CreateItineraryRequest) {
    if (!req.title.trim()) throw new Error("Title is required");
    if (new Date(req.endDate) < new Date(req.startDate))
      throw new Error("End date must be after start date");
    const res = await apiRequest.createItinerary(req);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to create itinerary");
    return res.data.data;
  },

  async addPlanItem(req: AddPlanItemRequest) {
    const res = await apiRequest.addPlanItem(req);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to add item");
    return res.data.data;
  },

  async removePlanItem(itemId: number) {
    const res = await apiRequest.removePlanItem(itemId);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to remove item");
  },

  async shareItinerary(id: number) {
    const res = await apiRequest.shareItinerary(id);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to share");
    return res.data.data?.shareUrl;
  },
};
