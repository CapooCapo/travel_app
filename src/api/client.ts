import http from "../utils/http";
import { Res, PageRes } from "../dto/format";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateUserRequest,
  UserDTO,
} from "../dto/auth/user.DTO";
import {
  AttractionResponse,
  AttractionImageResponse,
  AttractionListRequest,
  CreateAttractionRequest,
} from "../dto/discovery/place.DTO";
import { EventResponse } from "../dto/event/event.DTO";
import { ReviewResponse } from "../dto/review/review.DTO";
import { NotificationResponse } from "../dto/notification/notification.DTO";

export const apiRequest = {
  // ─── AUTH ────────────────────────────────────────────────────────────────
  // POST /api/auth/login  → ApiResponse<LoginResponse{ token }>
  login(req: LoginRequest) {
    return http.post<Res<LoginResponse>>("/api/auth/login", req);
  },

  // POST /api/auth/register  → ApiResponse<Void>
  register(req: RegisterRequest) {
    return http.post<Res<null>>("/api/auth/register", req);
  },

  // POST /api/auth/google  → ApiResponse<LoginResponse{ token }>
  googleLogin(idToken: string) {
    return http.post<Res<LoginResponse>>("/api/auth/google", { idToken });
  },

  // POST /api/auth/forgot-password  → ApiResponse<Void>
  forgotPassword(email: string) {
    return http.post<Res<null>>("/api/auth/forgot-password", { email });
  },

  // POST /api/auth/verify-otp  → ApiResponse<Void>
  verifyOtp(email: string, otp: string) {
    return http.post<Res<null>>("/api/auth/verify-otp", { email, otp });
  },

  // POST /api/auth/reset-password  → ApiResponse<Void>
  resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string) {
    return http.post<Res<null>>("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
  },

  // ─── ATTRACTIONS ──────────────────────────────────────────────────────────
  // GET /api/attractions?keyword=&rating=&page=&size=  → ApiResponse<Page<AttractionResponse>>
  getAttractions(params: AttractionListRequest) {
    return http.get<Res<PageRes<AttractionResponse>>>("/api/attractions", {
      params,
    });
  },

  // GET /api/attractions/{id}  → ApiResponse<AttractionResponse>
  getAttractionById(id: number) {
    return http.get<Res<AttractionResponse>>(`/api/attractions/${id}`);
  },

  // GET /api/attractions/nearby?lat=&lng=&page=&size=  → ApiResponse<Page<AttractionResponse>>
  getNearbyAttractions(lat: number, lng: number, page = 0, size = 10) {
    return http.get<Res<PageRes<AttractionResponse>>>(
      "/api/attractions/nearby",
      {
        params: { lat, lng, page, size },
      },
    );
  },

  // GET /api/attractions/popular?page=&size=  → ApiResponse<Page<AttractionResponse>>
  getPopularAttractions(page = 0, size = 10) {
    return http.get<Res<PageRes<AttractionResponse>>>(
      "/api/attractions/popular",
      {
        params: { page, size },
      },
    );
  },

  // POST /api/attractions  → ApiResponse<AttractionResponse>
  createAttraction(req: CreateAttractionRequest) {
    return http.post<Res<AttractionResponse>>("/api/attractions", req);
  },

  // POST /api/attractions/by-interests  body: number[]  → ApiResponse<Page<AttractionResponse>>
  getAttractionsByInterests(interestIds: number[], page = 0, size = 10) {
    return http.post<Res<PageRes<AttractionResponse>>>(
      `/api/attractions/by-interests?page=${page}&size=${size}`,
      interestIds,
    );
  },

  // ─── ATTRACTION IMAGES ───────────────────────────────────────────────────
  // GET /api/attraction-images/{id}/images  → ApiResponse<List<AttractionImageResponse>>
  getAttractionImages(attractionId: number) {
    return http.get<Res<AttractionImageResponse[]>>(
      `/api/attraction-images/${attractionId}/images`,
    );
  },

  // ─── BOOKMARKS ───────────────────────────────────────────────────────────
  // POST /api/bookmarks/{attractionId}  → ApiResponse<Void>
  addBookmark(attractionId: number) {
    return http.post<Res<null>>(`/api/bookmarks/${attractionId}`);
  },

  // DELETE /api/bookmarks/{attractionId}  → ApiResponse<Void>
  removeBookmark(attractionId: number) {
    return http.delete<Res<null>>(`/api/bookmarks/${attractionId}`);
  },

  // GET /api/bookmarks  → ApiResponse<List<AttractionResponse>>
  getBookmarks() {
    return http.get<Res<AttractionResponse[]>>("/api/bookmarks");
  },

  // ─── REVIEWS ─────────────────────────────────────────────────────────────
  // POST /api/attractions/{id}/reviews  body: { rating, content, imageUrl }  → ApiResponse<Void>
  createReview(
    attractionId: number,
    rating: number,
    content: string,
    imageUrl?: string,
  ) {
    return http.post<Res<null>>(`/api/attractions/${attractionId}/reviews`, {
      rating,
      content,
      imageUrl,
    });
  },

  // GET /api/attractions/{id}/reviews?page=&size=  → ApiResponse<PageResponse<ReviewResponse>>
  getReviews(attractionId: number, page = 0, size = 10) {
    return http.get<Res<PageRes<ReviewResponse>>>(
      `/api/attractions/${attractionId}/reviews`,
      { params: { page, size } },
    );
  },

  // ─── EVENTS ──────────────────────────────────────────────────────────────
  // GET /api/events/attraction/{attractionId}?page=&size=  → ApiResponse<PageResponse<EventResponse>>
  getEventsByAttraction(attractionId: number, page = 0, size = 10) {
    return http.get<Res<PageRes<EventResponse>>>(
      `/api/events/attraction/${attractionId}`,
      { params: { page, size } },
    );
  },

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
  // GET /api/notifications  → List<NotificationResponse>  (KHÔNG có ApiResponse wrapper!)
  getNotifications() {
    return http.get<NotificationResponse[]>("/api/notifications");
  },

  // ─── USERS ───────────────────────────────────────────────────────────────
  // GET /api/users/me  → UserResponse
  getMe() {
    return http.get<UserDTO>("/api/users/me");
  },

  // PUT /api/users/updateProfile  body: UpdateUserRequest  → UserResponse
  updateProfile(req: UpdateUserRequest) {
    return http.put<UserDTO>("/api/users/updateProfile", req);
  },

  // PUT /api/users/me/interests  body: number[]  → UserResponse
  updateInterests(interestIds: number[]) {
    return http.put<UserDTO>("/api/users/me/interests", interestIds);
  },

  // GET /api/users/me/data  → UserDataResponse
  exportUserData() {
    return http.get("/api/users/me/data");
  },

  // ─── SOCIAL ──────────────────────────────────────────────────────────────
  getFeed(page = 1) {
    return http.get<Res<any>>(`/api/social/feed?page=${page}`);
  },
  followUser(req: any) {
    // Thêm import FollowRequest ở đầu file nếu muốn type chặt chẽ
    return http.post<Res<any>>("/api/social/follow", req);
  },
  unfollowUser(req: any) {
    return http.post<Res<any>>("/api/social/unfollow", req);
  },
  getUserProfile(userId: number) {
    return http.get<Res<any>>(`/api/users/${userId}/profile`);
  },

  getAiRecommendations(lat: number, lng: number) {
    return http.get<Res<any>>("/api/attractions/ai-recommend", {
      params: { lat, lng },
    });
  },
};
