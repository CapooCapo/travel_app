export type FeedItemDTO = {
  id: number;
  actorId: number;
  userName: string;
  userAvatar?: string;
  type: 
    | 'REVIEW_CREATED' 
    | 'ITINERARY_CREATED' 
    | 'EVENT_JOINED' 
    | 'LOCATION_SHARED' 
    | 'USER_FOLLOWED' 
    | 'LOCATION_ADDED'
    | 'SYSTEM';
  message: string;
  content?: string;
  targetName: string;
  targetId: number;
  targetType: 'LOCATION' | 'EVENT' | 'USER' | 'OTHER';
  isFollowing?: boolean;
  createdAt: string;
};

export type UserPublicDTO = {
  id: number;
  fullName: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
};

export type FollowRequest = {
  targetUserId: number;
};

export type SocialFeedResponse = {
  items: FeedItemDTO[];
  page: number;
  total: number;
};
