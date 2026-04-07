import http from "../utils/http";
import { Res, PageRes } from "../dto/format";
import { EventResponse } from "../dto/event/event.DTO";

export const eventApi = {
  getEventsByLocation(locationId: number, page = 0, size = 10) {
    return http.get<Res<PageRes<EventResponse>>>(`/api/events/location/${locationId}`, { params: { page, size } });
  },
  createEvent(req: any) {
    return http.post<Res<any>>("/api/events", req);
  },
};
