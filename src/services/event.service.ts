import { apiRequest } from "../api/client";
import { EventDTO, mapEvent } from "../dto/event/event.DTO";

/**
 * BE chỉ có: GET /api/events/location/{locationId}
 * Không có endpoint list toàn bộ events hay tạo event.
 */
export const eventService = {

  /** GET /api/events/location/{locationId} */
  async getEventsByLocation(locationId: number, page = 0, size = 10): Promise<{
    events: EventDTO[];
    totalPages: number;
  }> {
    const res = await apiRequest.getEventsByLocation(locationId, page, size);
    const pageData = res.data?.data;
    const events = (pageData?.content ?? []).map(mapEvent);
    return { events, totalPages: pageData?.totalPages ?? 0 };
  },
};
