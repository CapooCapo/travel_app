import { apiRequest } from "../api/client";
import { FollowRequest } from "../dto/social/social.DTO";

export const socialService = {
  async getFeed(page: number = 1) {
    const res = await apiRequest.getFeed(page);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to fetch feed");
    return res.data.data;
  },

  async followUser(req: FollowRequest) {
    const res = await apiRequest.followUser(req);
    if (res.status !== 200) throw new Error(res.data.message || "Follow failed");
    return res.data.data;
  },

  async unfollowUser(req: FollowRequest) {
    const res = await apiRequest.unfollowUser(req);
    if (res.status !== 200) throw new Error(res.data.message || "Unfollow failed");
    return res.data.data;
  },

  async getUserProfile(userId: number) {
    const res = await apiRequest.getUserProfile(userId);
    if (res.status !== 200) throw new Error(res.data.message || "User not found");
    return res.data.data;
  },

  async searchUsers(keyword: string) {
    const res = await apiRequest.searchUsers(keyword);
    if (res.status !== 200) throw new Error(res.data.message || "Search failed");
    return res.data; // API users/search usually returns List<UserDTO> directly or wrapped in Res
  },
};
