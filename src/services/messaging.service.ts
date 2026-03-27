import { apiRequest } from "../api/client";
import { SendMessageRequest, CreateChatRequest } from "../dto/messaging/message.DTO";

export const messagingService = {
  async getChats() {
    const res = await apiRequest.getChats();
    if (res.status !== 200) throw new Error(res.data.message || "Failed to fetch chats");
    return res.data.data;
  },

  async getChatById(chatId: number) {
    const res = await apiRequest.getChatById(chatId);
    if (res.status !== 200) throw new Error(res.data.message || "Chat not found");
    return res.data.data;
  },

  async createChat(req: CreateChatRequest) {
    const res = await apiRequest.createChat(req);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to create chat");
    return res.data.data;
  },

  async getMessages(chatId: number, page: number = 1) {
    const res = await apiRequest.getMessages(chatId, page);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to fetch messages");
    return res.data.data;
  },

  async sendMessage(req: SendMessageRequest) {
    if (!req.content.trim() && req.type === 'text')
      throw new Error("Message cannot be empty");
    const res = await apiRequest.sendMessage(req);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to send message");
    return res.data.data;
  },

  async pinMessage(chatId: number, messageId: number) {
    const res = await apiRequest.pinMessage(chatId, messageId);
    if (res.status !== 200) throw new Error(res.data.message || "Failed to pin message");
  },
};
