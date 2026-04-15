import http from "../utils/http";
import { Res, PageRes } from "../dto/format";
import { UserDTO } from "../dto/auth/user.DTO";
import { EventResponse } from "../dto/event/event.DTO";

export const adminApi = {
  getUsers(page = 0, size = 20) {
    return http.get<Res<PageRes<UserDTO>>>(`/api/admin/users?page=${page}&size=${size}`)
      .then(res => res.data);
  },
  getEvents(status?: string, page = 0, size = 10) {
    const statusQuery = status ? `&status=${status}` : "";
    return http.get<Res<PageRes<any>>>(`/api/admin/events?page=${page}&size=${size}${statusQuery}`)
      .then(res => res.data);
  },
  approveEvent(id: number) {
    return http.post<Res<void>>(`/api/admin/events/${id}/approve`)
      .then(res => res.data);
  },
  rejectEvent(id: number) {
    return http.post<Res<void>>(`/api/admin/events/${id}/reject`)
      .then(res => res.data);
  },
  getReports(status?: string, page = 0, size = 10) {
    const statusQuery = status ? `&status=${status}` : "";
    return http.get<Res<PageRes<any>>>(`/api/admin/reports?page=${page}&size=${size}${statusQuery}`)
      .then(res => res.data);
  },
  resolveReport(id: number, status: string) {
    return http.put<Res<void>>(`/api/admin/reports/${id}/resolve?status=${status}`)
      .then(res => res.data);
  },
  getAnalytics() {
    return http.get<Res<any>>("/api/admin/analytics")
      .then(res => res.data);
  },
};
