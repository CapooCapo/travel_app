import { apiRequest } from "../api/client";
import { ReviewDTO, mapReview } from "../dto/review/review.DTO";

/**
 * Reviews gắn với location:
 *   POST /api/locations/{id}/reviews
 *   GET  /api/locations/{id}/reviews
 */
export const reviewService = {

  /** GET /api/locations/{locationId}/reviews */
  async getReviews(locationId: number, page = 0, size = 10): Promise<{
    reviews: ReviewDTO[];
    totalPages: number;
  }> {
    try {
      const res = await apiRequest.getReviews(locationId, page, size);
      if (res.status !== "success" && res.status !== 200) throw new Error(res.message);
      
      const pageData = res.data;
      const reviews = (pageData?.content ?? []).map(mapReview);
      return { reviews, totalPages: pageData?.totalPages ?? 0 };
    } catch (e) {
      console.error("reviewService.getReviews error:", e);
      return { reviews: [], totalPages: 0 };
    }
  },

  /** POST /api/locations/{locationId}/reviews */
  async createReview(
    locationId: number,
    rating: number,
    content: string,
    imageUrl?: string,
  ): Promise<void> {
    if (!content.trim()) throw new Error("Review content is required");
    if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
    const res = await apiRequest.createReview(locationId, rating, content.trim(), imageUrl);
    if (res.status !== "success" && res.status !== 200) throw new Error(res.message);
  },
};
