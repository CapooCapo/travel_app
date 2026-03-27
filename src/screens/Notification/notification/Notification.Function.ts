import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { notificationService } from "../../../services/notification.service";
import { NotificationDTO } from "../../../dto/notification/notification.DTO";

export function NotificationFunction() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res?.notifications ?? []);
      setUnreadCount(res?.unreadCount ?? 0);
    } catch {
      // Silently fallback — non-critical
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e: any) {
      Alert.alert("Error", e?.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e: any) {
      Alert.alert("Error", e?.message);
    }
  };

  const grouped = notifications.reduce<Record<string, NotificationDTO[]>>(
    (acc, n) => {
      const key = n.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(n);
      return acc;
    },
    {}
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    grouped,
    handleMarkRead,
    handleMarkAllRead,
    loadNotifications,
  };
}
