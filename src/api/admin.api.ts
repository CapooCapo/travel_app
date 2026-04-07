import http from "../utils/http";

export const adminApi = {
  getUsers(page = 0, size = 20) {
    return http.get(`/api/admin/users?page=${page}&size=${size}`);
  },
  getEvents(status?: string, page = 0, size = 10) {
    const statusQuery = status ? `&status=${status}` : "";
    return http.get(`/api/admin/events?page=${page}&size=${size}${statusQuery}`);
  },
  approveEvent(id: number) {
    return http.put(`/api/admin/events/${id}/approve`);
  },
  rejectEvent(id: number) {
    return http.put(`/api/admin/events/${id}/reject`);
  },
  getReports(status?: string, page = 0, size = 10) {
    const statusQuery = status ? `&status=${status}` : "";
    return http.get(`/api/admin/reports?page=${page}&size=${size}${statusQuery}`);
  },
  resolveReport(id: number, status: string) {
    return http.put(`/api/admin/reports/${id}/resolve?status=${status}`);
  },
  getAnalytics() {
    return http.get("/api/admin/analytics");
  },
};
