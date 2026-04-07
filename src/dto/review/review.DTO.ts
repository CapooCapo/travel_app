/**
 * Khớp BE ReviewResponse:
 * { id, rating, content, imageUrl, userName }
 *
 * Reviews gắn với location:
 *   POST GET /api/locations/{id}/reviews
 */
export type ReviewResponse = {
  id: number;
  rating: number;
  content: string;
  imageUrl?: string;
  userName: string;
};

/**
 * ReviewDTO — kiểu dùng nội bộ FE, map từ ReviewResponse.
 * comment = content, photoUrls lấy từ imageUrl nếu có.
 */
export type ReviewDTO = {
  id: number;
  rating: number;
  comment: string;          // mapped từ content
  imageUrl?: string;
  userName: string;
  userAvatar?: string;
  createdAt?: string;
};

/**
 * Khớp BE CreateReviewRequest:
 * { rating, content, imageUrl }
 *
 * locationId truyền qua path param, không phải body.
 */
export type CreateReviewRequest = {
  locationId: number;     // đi vào path: /api/locations/{locationId}/reviews
  rating: number;
  content: string;          // BE dùng content, không phải comment
  imageUrl?: string;
};

export type ReviewListRequest = {
  locationId: number;     // path param
  page?: number;
  size?: number;
};

/** Helper: map BE ReviewResponse → FE ReviewDTO */
export function mapReview(r: ReviewResponse): ReviewDTO {
  return {
    id:        r.id,
    rating:    r.rating,
    comment:   r.content,
    imageUrl:  r.imageUrl,
    userName:  r.userName,
  };
}
