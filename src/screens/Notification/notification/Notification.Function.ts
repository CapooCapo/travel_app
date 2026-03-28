import { useState, useEffect } from "react";
import { notificationService } from "../../../services/notification.service";
import { NotificationDTO } from "../../../dto/notification/notification.DTO";

export function NotificationFunction() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isLoading, setIsLoading]         = useState(true);

  // Tính unreadCount từ state (BE không có markRead endpoint)
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // getNotifications() trả NotificationDTO[] trực tiếp
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } catch {
      // Non-critical — silently ignore
    } finally {
      setIsLoading(false);
    }
  };

  // Mark read locally (BE chưa có endpoint này)
  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      notificationService.markReadLocally(prev, id)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      notificationService.markAllReadLocally(prev)
    );
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    handleMarkRead,
    handleMarkAllRead,
    loadNotifications,
  };
}
