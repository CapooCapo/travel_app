import { useState, useEffect } from "react";
import { socialService } from "../../../services/social.service";
import { messagingService } from "../../../services/messaging.service";
import { UserDTO } from "../../../dto/auth/user.DTO";

export function useUserProfile(userId: number, navigation: any) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derive isFollowing from user object for single source of truth
  const isFollowing = !!user?.isFollowing;

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    console.log(`[useUserProfile] Fetching profile ground-truth for userId: ${userId}`);
    try {
      const data = await socialService.getUserProfile(userId);
      setUser(data);
    } catch (error: any) {
      console.error("[useUserProfile] Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowChange = async () => {
    if (!user) return;

    // 1. Optimistic UI Update
    const previousUser = { ...user };
    const nextFollowing = !isFollowing;
    const nextFollowerCount = (user.followersCount || 0) + (nextFollowing ? 1 : -1);
    
    // [FE DEBUG] Optimistic Update: nextFollowerCount
    console.log(`[useUserProfile] Optimistic Update: nextFollowerCount=${nextFollowerCount}`);

    setUser({
      ...user,
      isFollowing: nextFollowing,
      followersCount: nextFollowerCount >= 0 ? nextFollowerCount : 0,
    });

    try {
      // 2. API Call
      if (isFollowing) {
        await socialService.unfollowUser({ targetUserId: userId });
      } else {
        await socialService.followUser({ targetUserId: userId });
      }
      
      // 3. Final Sync with Backend to ensure all counts (including side-effects) are correct
      await loadProfile();
    } catch (error) {
      console.error("[useUserProfile] Follow/Unfollow error, reverting state:", error);
      // Revert if API fails
      setUser(previousUser);
    }
  };

  const handleMessage = async () => {
    console.log(`[useUserProfile] Handling message for userId: ${userId}`);
    try {
      const chatRoom = await messagingService.getOrCreatePrivateChat(userId);
      console.log(`[useUserProfile] Chat room ready:`, chatRoom.id);
      navigation.navigate("ChatRoom", { 
        chatRoomId: Number(chatRoom.id),
        chatName: user?.fullName || "Chat",
        chatType: "one_to_one"
      });
    } catch (error) {
      console.error("[useUserProfile] Error initiating chat:", error);
    }
  };

  return {
    user,
    isLoading,
    isFollowing,
    handleFollowChange,
    handleMessage,
    refresh: loadProfile,
  };
}
