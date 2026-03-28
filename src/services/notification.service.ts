import { apiRequest } from "../api/client";
import { NotificationDTO, mapNotification } from "../dto/notification/notification.DTO";

/**
 * QUAN TRỌNG: GET /api/notifications
 * BE trả thẳng List<NotificationResponse> — KHÔNG có ApiResponse wrapper.
 * Axios sẽ wrap vào response.data trực tiếp → mảng.
 */
export const notificationService = {

  async getNotifications(): Promise<NotificationDTO[]> {
    const res = await apiRequest.getNotifications();
    // res.data là List<NotificationResponse> trực tiếp (mảng)
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map(mapNotification);
  },

  // BE hiện chưa có endpoint markRead / markAllRead
  // → Implement phía FE bằng cách cập nhật state local
  markReadLocally: (
    notifications: NotificationDTO[],
    id: number
  ): NotificationDTO[] =>
    notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),

  markAllReadLocally: (
    notifications: NotificationDTO[]
  ): NotificationDTO[] =>
    notifications.map((n) => ({ ...n, isRead: true })),
};
