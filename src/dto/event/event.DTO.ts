/**
 * Khớp BE EventResponse:
 * { id, name, description, eventDate, locationId }
 *
 * Lưu ý: BE không có endpoint list toàn bộ events.
 * Events luôn gắn với location: GET /api/events/location/{locationId}
 */
export type EventResponse = {
  id: number;
  name: string;
  description: string;
  eventDate: string;       // LocalDateTime → ISO string
  locationId: number;
};

/**
 * EventDTO — kiểu dùng nội bộ FE, map từ EventResponse.
 * title = name, startDate = eventDate (BE chưa có endDate).
 */
export type EventDTO = {
  id: number;
  title: string;           // mapped từ name
  description: string;
  startDate: string;       // mapped từ eventDate
  endDate?: string;        // BE chưa có — optional
  locationId: number;
  address?: string;        // lấy từ location parent nếu cần
  imageUrl?: string;
  isFree?: boolean;
  price?: number;
  status?: 'incoming' | 'ongoing' | 'completed';
  organizerId?: number;
  organizerName?: string;
  isBookmarked?: boolean;
};

export type EventListRequest = {
  page?: number;
  size?: number;
};

/** Helper: map BE EventResponse → FE EventDTO */
export function mapEvent(e: EventResponse): EventDTO {
  return {
    id:           e.id,
    title:        e.name,
    description:  e.description,
    startDate:    e.eventDate,
    locationId: e.locationId,
    status:       resolveStatus(e.eventDate),
  };
}

function resolveStatus(eventDate: string): EventDTO['status'] {
  const now  = Date.now();
  const date = new Date(eventDate).getTime();
  if (date > now) return 'incoming';
  return 'ongoing';
}
