import { useState, useEffect } from "react";
import { messagingService } from "../../../services/messaging.service";
import { ChatDTO } from "../../../dto/messaging/message.DTO";

export function ChatListFunction(navigation: any) {
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
    navigation.navigate("ChatRoom", {
      chatId: chat.id,
      chatName: chat.name ?? chat.participants
        .map((p) => p.userName)
        .join(", "),
      chatType: chat.type,
    });
  };

  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    chats, isLoading, totalUnread,
    navigateToChatRoom, loadChats,
  };
}
