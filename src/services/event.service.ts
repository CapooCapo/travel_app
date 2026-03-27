import { apiRequest } from "../api/client";
import { EventDTO, mapEvent } from "../dto/event/event.DTO";

/**
 * BE chỉ có: GET /api/events/attraction/{attractionId}
 * Không có endpoint list toàn bộ events hay tạo event.
 */
export const eventService = {

  /** GET /api/events/attraction/{attractionId} */
  async getEventsByAttraction(attractionId: number, page = 0, size = 10): Promise<{
    events: EventDTO[];
    totalPages: number;
  }> {
    const res = await apiRequest.getEventsByAttraction(attractionId, page, size);
    const pageData = res.data?.data;
    const events = (pageData?.content ?? []).map(mapEvent);
    return { events, totalPages: pageData?.totalPages ?? 0 };
  },
};
