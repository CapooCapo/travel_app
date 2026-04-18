import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
import { FollowRequest } from "../dto/social/social.DTO";

export const socialService = {
  async getFeed(page: number = 0, types?: string[]) {
    const res = await apiRequest.getFeed(page, types);
    return unwrapResponse(res) || { content: [] }; 
  },

  async followUser(req: FollowRequest) {
    const res = await apiRequest.followUser(req);
    return unwrapResponse(res);
  },

  async unfollowUser(req: FollowRequest) {
    const res = await apiRequest.unfollowUser(req);
    return unwrapResponse(res);
  },

  async getUserProfile(userId: number) {
    const res = await apiRequest.getUserProfile(userId);
    return unwrapResponse(res);
  },

  async searchUsers(query: string, limit = 10, offset = 0) {
    const res = await apiRequest.searchUsers(query, limit, offset);
    return unwrapResponse(res) || []; 
  },
};
