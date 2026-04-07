import http from "../utils/http";
import { Res, PageRes } from "../dto/format";
import {
  LocationResponse,
  LocationImageResponse,
  LocationListRequest,
  CreateLocationRequest,
} from "../dto/discovery/place.DTO";
import { ReviewResponse } from "../dto/review/review.DTO";

export const locationApi = {
  getLocations(params: LocationListRequest) {
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations", { params });
  },
  getLocationById(id: number) {
    return http.get<Res<LocationResponse>>(`/api/locations/${id}`);
  },
  getNearbyLocations(lat: number, lng: number, page = 0, size = 10) {
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations/nearby", { params: { lat, lng, page, size } });
  },
  getPopularLocations(page = 0, size = 10) {
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations/popular", { params: { page, size } });
  },
  createLocation(req: CreateLocationRequest) {
    return http.post<Res<LocationResponse>>("/api/locations", req);
  },
  getLocationsByInterests(interestIds: number[], page = 0, size = 10) {
    return http.post<Res<PageRes<LocationResponse>>>(`/api/locations/by-interests?page=${page}&size=${size}`, interestIds);
  },
  getLocationImages(locationId: number) {
    return http.get<Res<LocationImageResponse[]>>(`/api/locations/${locationId}/images`);
  },
  addBookmark(locationId: number) {
    return http.post<Res<null>>(`/api/bookmarks/${locationId}`);
  },
  removeBookmark(locationId: number) {
    return http.delete<Res<null>>(`/api/bookmarks/${locationId}`);
  },
  getBookmarks() {
    return http.get<Res<LocationResponse[]>>("/api/bookmarks");
  },
  createReview(locationId: number, rating: number, content: string, imageUrl?: string) {
    return http.post<Res<null>>(`/api/locations/${locationId}/reviews`, { rating, content, imageUrl });
  },
  getReviews(locationId: number, page = 0, size = 10) {
    return http.get<Res<PageRes<ReviewResponse>>>(`/api/locations/${locationId}/reviews`, { params: { page, size } });
  },
  getAiRecommendations(lat: number, lng: number, userId: number) {
    return http.post<Res<any>>("/api/locations/ai-recommend", { lat, lng, userId });
  },
};
