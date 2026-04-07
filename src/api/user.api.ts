import http from "../utils/http";
import { Res } from "../dto/format";
import { UpdateUserRequest, UserDTO } from "../dto/auth/user.DTO";

export const userApi = {
  getMe() {
    return http.get<Res<UserDTO>>("/api/users/me");
  },
  updateProfile(req: UpdateUserRequest) {
    return http.put<Res<UserDTO>>("/api/users/updateProfile", req);
  },
  updateInterests(interestIds: number[]) {
    return http.put<Res<UserDTO>>("/api/users/me/interests", interestIds);
  },
  updateAvatar(avatarUrl: string) {
    console.log(`[FE DEBUG] PUT /api/users/avatar - payload:`, { avatarUrl });
    return http.put<Res<UserDTO>>("/api/users/avatar", { avatarUrl })
      .then(res => {
        console.log(`[FE DEBUG] PUT /api/users/avatar - response:`, res.data);
        return res;
      });
  },
  exportUserData() {
    return http.get("/api/users/me/data");
  },
  getUserProfile(userId: number) {
    console.log(`[FE DEBUG] GET /api/users/profile/${userId}`);
    return http.get<Res<UserDTO>>(`/api/users/profile/${userId}`);
  },
};
