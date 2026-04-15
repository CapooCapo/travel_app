import http from "../utils/http";
import { Res } from "../dto/format";
import { UserDTO } from "../dto/auth/user.DTO";

export const socialApi = {
  getFeed(page = 1, types?: string[]) {
    return http.get<Res<any>>("/api/social/feed", {
      params: { page, types }
    }).then(res => res.data);
  },
  followUser(req: any) {
    if (!req.targetUserId) {
      console.error("[socialApi] followUser called with invalid targetUserId");
      return Promise.reject(new Error("Invalid targetUserId"));
    }
    console.log(`[socialApi] POST /api/users/${req.targetUserId}/follow`);
    return http.post<Res<any>>(`/api/users/${req.targetUserId}/follow`)
      .then(res => res.data);
  },
  unfollowUser(req: any) {
    if (!req.targetUserId) {
      console.error("[socialApi] unfollowUser called with invalid targetUserId");
      return Promise.reject(new Error("Invalid targetUserId"));
    }
    console.log(`[socialApi] DELETE /api/users/${req.targetUserId}/follow`);
    return http.delete<Res<any>>(`/api/users/${req.targetUserId}/follow`)
      .then(res => res.data);
  },
  searchUsers(query: string, limit = 20, offset = 0) {
    const payload = { query, limit, offset };
    const absoluteUrl = `${http.defaults.baseURL}/api/users/search`;

    console.log("[socialApi] Searching users (Trying POST)...", {
      action: "Call searchUsers API",
      method: "POST",
      url: absoluteUrl,
      headers: {
        ...http.defaults.headers.common,
        "Content-Type": "application/json"
      },
      payload
    });

    return http.post<Res<UserDTO[]>>("/api/users/search", payload)
      .then(res => res.data);
  },
};
