import { useState, useEffect } from "react";
import { messagingService } from "../../../services/messaging.service";
import { ChatDTO } from "../../../dto/messaging/message.DTO";

export function useChatList(navigation: any) {
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
    // For private chats, we want the name of the OTHER participant.
    // However, without knowing the current user ID here, we'll just filter out 
    // any null/empty names and join what remains.
    // Ideally, the backend should provide a 'displayName' for the chat.
    const chatName = chat.name || chat.participants
      .map(p => p.userName)
      .filter(name => !!name)
      .join(", ");

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
