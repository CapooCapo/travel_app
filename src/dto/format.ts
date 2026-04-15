/**
 * Wrapper khớp BE ApiResponse<T>:
 * { status, message, data, timestamp }
 *
 * Notifications trả thẳng mảng (không wrapper) —
 * xem notification.service.ts để biết cách xử lý.
 */
export type Res<T> = {
  status: string | number; // BE sends String "success", but some FE code might expect number
  message: string;
  data: T;
  timestamp?: number;
};

/**
 * BE PageResponse<T>
 * { page, size, totalElements, totalPages, content }
 */
export type PageRes<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
};
