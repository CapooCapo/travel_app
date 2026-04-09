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
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations", { params })
      .then(res => res.data.data);
  },
  getLocationById(id: number) {
    return http.get<Res<LocationResponse>>(`/api/locations/${id}`)
      .then(res => res.data.data);
  },
  getNearbyLocations(lat: number, lng: number, page = 0, size = 10) {
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations/nearby", { params: { lat, lng, page, size } })
      .then(res => res.data.data);
  },
  getPopularLocations(page = 0, size = 10) {
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations/popular", { params: { page, size } })
      .then(res => res.data.data);
  },
  createLocation(req: CreateLocationRequest) {
    return http.post<Res<LocationResponse>>("/api/locations", req)
      .then(res => res.data.data);
  },
  getLocationsByInterests(interestIds: number[], page = 0, size = 10) {
    return http.post<Res<PageRes<LocationResponse>>>(`/api/locations/by-interests?page=${page}&size=${size}`, interestIds)
      .then(res => res.data.data);
  },
  getLocationImages(locationId: number) {
    return http.get<Res<LocationImageResponse[]>>(`/api/locations/${locationId}/images`)
      .then(res => res.data.data);
  },
  addBookmark(locationId: number) {
    return http.post<Res<null>>(`/api/bookmarks/${locationId}`)
      .then(res => res.data.data);
  },
  removeBookmark(locationId: number) {
    return http.delete<Res<null>>(`/api/bookmarks/${locationId}`)
      .then(res => res.data.data);
  },
  getBookmarks() {
    return http.get<Res<LocationResponse[]>>("/api/users/me/bookmarks")
      .then(res => res.data.data);
  },
  createReview(locationId: number, rating: number, content: string, imageUrl?: string) {
    return http.post<Res<null>>(`/api/locations/${locationId}/reviews`, { rating, content, imageUrl })
      .then(res => res.data.data);
  },
  getReviews(locationId: number, page = 0, size = 10) {
    return http.get<Res<PageRes<ReviewResponse>>>(`/api/locations/${locationId}/reviews`, { params: { page, size } })
      .then(res => res.data.data);
  },
  getAiRecommendations(lat: number, lng: number, userId: number) {
    return http.post<Res<any>>("/api/locations/ai-recommend", { lat, lng, userId })
      .then(res => res.data.data);
  },
  searchLocations(keyword: string) {
    return http.get<Res<PageRes<LocationResponse>>>("/api/locations", { params: { keyword, size: 5 } })
      .then(res => res.data.data);
  },
};
