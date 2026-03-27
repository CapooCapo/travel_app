export type FeedItemDTO = {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  type: 'rating' | 'event_join' | 'bookmark' | 'review';
  message: string;
  targetName: string;
  targetId: number;
  targetType: 'place' | 'event';
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
