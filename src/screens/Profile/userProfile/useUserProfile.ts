import { useState, useEffect } from "react";
import { socialService } from "../../../services/social.service";
import { messagingService } from "../../../services/messaging.service";
import { UserDTO } from "../../../dto/auth/user.DTO";

export function useUserProfile(userId: number, navigation: any) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    console.log(`[UserProfileScreen] Fetching profile for userId: ${userId}`);
    try {
      const data = await socialService.getUserProfile(userId);
      setUser(data);
      if (data?.isFollowing !== undefined) {
        setIsFollowing(data.isFollowing);
      }
    } catch (error: any) {
      console.error("[useUserProfile] Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowChange = async () => {
    try {
      if (isFollowing) {
        await socialService.unfollowUser({ targetUserId: userId });
        setIsFollowing(false);
      } else {
        await socialService.followUser({ targetUserId: userId });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("[useUserProfile] Follow/Unfollow error:", error);
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
