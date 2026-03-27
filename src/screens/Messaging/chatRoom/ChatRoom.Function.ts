import { useState, useEffect, useRef } from "react";
import { FlatList } from "react-native";
import { messagingService } from "../../../services/messaging.service";
import { MessageDTO } from "../../../dto/messaging/message.DTO";

export function ChatRoomFunction(navigation: any, chatId: number) {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState<MessageDTO | null>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    loadChat();
  }, [chatId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await messagingService.getMessages(chatId, 1);
      setMessages((res ?? []).reverse());
    } catch {
      // Silent
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async () => {
    try {
      const chat = await messagingService.getChatById(chatId);
      if (chat?.pinnedMessage) setPinnedMessage(chat.pinnedMessage);
    } catch {
      // Silent
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;
    setInputText("");
    setIsSending(true);
    try {
      const sent = await messagingService.sendMessage({
        chatId,
        content: text,
        type: "text",
      });
      if (sent) {
        setMessages((prev) => [...prev, sent]);
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch {
      setInputText(text); // restore on failure
    } finally {
      setIsSending(false);
    }
  };

  const handlePinMessage = async (messageId: number) => {
    try {
      await messagingService.pinMessage(chatId, messageId);
      const msg = messages.find((m) => m.id === messageId);
      if (msg) setPinnedMessage(msg);
    } catch {
      // Silent
    }
  };

  return {
    messages, isLoading, inputText, setInputText,
    isSending, pinnedMessage, listRef,
    handleSend, handlePinMessage,
    goBack: () => navigation.goBack(),
  };
}
