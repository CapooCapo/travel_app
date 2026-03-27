import { apiRequest } from "../api/client";
import { ReviewDTO, mapReview } from "../dto/review/review.DTO";

/**
 * Reviews gắn với attraction:
 *   POST /api/attractions/{id}/reviews
 *   GET  /api/attractions/{id}/reviews
 */
export const reviewService = {

  /** GET /api/attractions/{attractionId}/reviews */
  async getReviews(attractionId: number, page = 0, size = 10): Promise<{
    reviews: ReviewDTO[];
    totalPages: number;
  }> {
    const res = await apiRequest.getReviews(attractionId, page, size);
    const pageData = res.data?.data;
    const reviews = (pageData?.content ?? []).map(mapReview);
    return { reviews, totalPages: pageData?.totalPages ?? 0 };
  },

  /** POST /api/attractions/{attractionId}/reviews */
  async createReview(
    attractionId: number,
    rating: number,
    content: string,
    imageUrl?: string,
  ): Promise<void> {
    if (!content.trim()) throw new Error("Review content is required");
    if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
    await apiRequest.createReview(attractionId, rating, content.trim(), imageUrl);
  },
};
