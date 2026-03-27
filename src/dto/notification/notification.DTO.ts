/**
 * Khớp BE NotificationResponse:
 * { id, title, message, isRead, createdAt }
 *
 * QUAN TRỌNG: GET /api/notifications trả thẳng List<NotificationResponse>
 * KHÔNG có wrapper ApiResponse — xử lý khác trong notification.service.ts.
 */
export type NotificationResponse = {
  id: number;
  title: string;
  message: string;          // BE dùng "message", FE hiển thị làm body
  isRead: boolean;
  createdAt: string;        // LocalDateTime → ISO string
};

/**
 * NotificationDTO — kiểu dùng nội bộ FE.
 * body = message (map từ BE).
 */
export type NotificationDTO = {
  id: number;
  title: string;
  body: string;             // mapped từ message
  isRead: boolean;
  createdAt: string;
  type?: 'offer' | 'alert' | 'message' | 'event' | 'review';  // FE-only
};

/** Helper: map BE NotificationResponse → FE NotificationDTO */
export function mapNotification(n: NotificationResponse): NotificationDTO {
  return {
    id:        n.id,
    title:     n.title,
    body:      n.message,
    isRead:    n.isRead,
    createdAt: n.createdAt,
  };
}
