import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { messagingService } from "../../../services/messaging.service";
import { ChatDTO } from "../../../dto/messaging/message.DTO";

export function useChatList(navigation: any) {
  const { user: clerkUser } = useUser();
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const res = await messagingService.getChats();
      setChats(res ?? []);
    } catch {
      // Silently handle
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToChatRoom = (chat: ChatDTO) => {
    const isGroup = chat.type === "GROUP";
    const otherParticipant = !isGroup 
      ? chat.participants.find(p => p.fullName !== clerkUser?.fullName) 
      : null;

    const chatName = chat.name || otherParticipant?.fullName || chat.participants[0]?.fullName || "Chat";

    navigation.navigate("ChatRoom", {
      chatRoomId: Number(chat.id),
      chatName: chatName,
      chatType: chat.type,
    });
  };

  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    chats, isLoading, totalUnread,
    navigateToChatRoom, loadChats,
  };
}
