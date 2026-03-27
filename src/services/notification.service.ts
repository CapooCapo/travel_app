import { apiRequest } from "../api/client";

export const notificationService = {
  async getNotifications() {
    const res = await apiRequest.getNotifications();
    if (res.status !== 200) throw new Error(res.data.message || "Failed to fetch notifications");
    return res.data.data;
  },

  async markRead(id: number) {
    await apiRequest.markNotificationRead(id);
  },

  async markAllRead() {
    await apiRequest.markAllNotificationsRead();
  },
};
