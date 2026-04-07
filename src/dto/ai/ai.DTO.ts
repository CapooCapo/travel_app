export type AiRecommendationDTO = {
  locationId: number;
  name: string;
  latitude: number;
  longitude: number;
  reason: string;
  address?: string;
  category?: string;
  imageUrls?: string[];
};
