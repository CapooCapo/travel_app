import http from "../utils/http";
import { Res } from "../dto/format";
import { UpdateUserRequest, UserDTO } from "../dto/auth/user.DTO";

export const userApi = {
  getMe() {
    return http.get<Res<UserDTO>>("/api/users/me")
      .then(res => res.data.data);
  },
  updateProfile(req: UpdateUserRequest) {
    return http.put<Res<UserDTO>>("/api/users/updateProfile", req)
      .then(res => res.data.data);
  },
  updateInterests(interestIds: number[]) {
    return http.put<Res<UserDTO>>("/api/users/me/interests", interestIds)
      .then(res => res.data.data);
  },
  updateAvatar(avatarUrl: string) {
    return http.put<Res<UserDTO>>("/api/users/avatar", { avatarUrl })
      .then(res => res.data.data);
  },
  exportData() {
    return http.get<Res<any>>("/api/users/export-data")
      .then(res => res.data.data);
  },
  exportUserData() {
    return http.get("/api/users/me/data")
      .then(res => res.data);
  },
  getUserProfile(userId: number) {
    return http.get<Res<UserDTO>>(`/api/users/profile/${userId}`)
      .then(res => res.data.data);
  },
  deleteAccount() {
    return http.delete<Res<void>>("/api/users/me")
      .then(res => res.data);
  },
  getExportDataLink() {
    return http.post<Res<{ url: string }>>("/api/users/actions/export-data-link")
      .then(res => res.data.data.url);
  },
};
