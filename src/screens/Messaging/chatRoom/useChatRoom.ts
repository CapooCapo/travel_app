import { useState, useEffect, useRef } from "react";
import { FlatList } from "react-native";
import { messagingService } from "../../../services/messaging.service";
import { MessageDTO } from "../../../dto/messaging/message.DTO";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from 'expo-location';
import { Alert } from "react-native";
import { MessageType } from "../../../constants/messageTypes";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.72:8080";
const WS_URL = BASE_URL.replace(/^http/, "ws") + "/ws";

export function useChatRoom(navigation: any, chatRoomId: number) {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState<MessageDTO | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const listRef = useRef<FlatList>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  
  const { getToken } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const me = await messagingService.getMe(); // Custom method to get own ID
        if (me?.id) setUserId(me.id);
      } catch (e) {
        console.warn("Could not get own userId for chat:", e);
      }
    };
    init();
    loadMessages();
    loadChat();

    let client: Client;
    const connectStomp = async () => {
      const token = await getToken({ template: 'jwt-template-account' });
      if (!token) return;

      client = new Client({
        brokerURL: WS_URL,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("[STOMP] Connected to WebSocket");
          // Backend broadcasts to /user/queue/messages for the specific user
          // StompJS translates this when we subscribe to /user/queue/messages
          client.subscribe("/user/queue/messages", (msg) => {
            const newMsg: MessageDTO = JSON.parse(msg.body);
            console.log("[STOMP] Received message:", newMsg);
            if (newMsg.chatRoomId === chatRoomId) {
              setMessages((prev) => {
                // Prevent duplicates
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              setTimeout(() => {
                listRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          });
        },
        onStompError: (frame) => {
          console.error("[STOMP] Error:", frame.headers['message'], frame.body);
        },
      });
      client.activate();
      setStompClient(client);
    };

    connectStomp();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [chatRoomId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await messagingService.getMessages(chatRoomId, 1);
      setMessages((res ?? []).reverse());
    } catch {
      // Silent
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async () => {
    try {
      const chat = await messagingService.getChatById(chatRoomId);
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
      // If we use STOMP to send directly we could do:
      // stompClient?.publish({ destination: "/app/chat.send", body: JSON.stringify({...}) });
      // But we mapped logic in REST endpoint too. Let's use the REST wrapper which we already built.
      const sent = await messagingService.sendMessage({
        chatRoomId: chatRoomId,
        content: text,
        type: MessageType.TEXT,
      });
      if (sent) {
        // Will be added twice if broadcast comes through? No, wait. 
        // The sender also receives STOMP broadcast according to BE logic:
        // "for (User participant : chat.getParticipants()) { ... convertAndSendToUser(...); }"
        // So we expect WebSocket to send it back. No need to add locally unless we want optimistic UI.
        // Let's add it locally but prevent duplicate via ID check.
        setMessages((prev) => {
          if (prev.some(m => m.id === sent.id)) return prev;
          return [...prev, sent];
        });
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
      await messagingService.pinMessage(chatRoomId, messageId);
      const msg = messages.find((m) => m.id === messageId);
      if (msg) setPinnedMessage(msg);
    } catch {
      // Silent
    }
  };

  const handleSendLocation = async () => {
    if (isSending) return;
    
    setIsSending(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to share your location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      let addressStr = "Shared Location";
      try {
        let rev = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (rev && rev.length > 0) {
          const first = rev[0];
          addressStr = [first.name, first.street, first.city].filter(Boolean).join(", ");
        }
      } catch (e) {
        console.warn("Reverse geocode failed:", e);
      }

      const sent = await messagingService.sendMessage({
        chatRoomId: chatRoomId,
        content: "Shared a location",
        type: MessageType.LOCATION,
        latitude,
        longitude,
        placeName: addressStr
      });

      if (sent) {
        setMessages((prev) => {
          if (prev.some(m => m.id === sent.id)) return prev;
          return [...prev, sent];
        });
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to send location:", error);
      Alert.alert('Error', 'Failed to share location. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages, isLoading, inputText, setInputText,
    isSending, pinnedMessage, listRef,
    handleSend, handleSendLocation, handlePinMessage, userId,
    goBack: () => navigation.goBack(),
  };
}
