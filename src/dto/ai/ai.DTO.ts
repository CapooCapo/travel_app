import { PlaceDTO } from "../discovery/place.DTO"; // Điều chỉnh đường dẫn cho đúng

export interface AiRecommendationDTO {
  attraction: PlaceDTO;
  aiReason: string;
}
