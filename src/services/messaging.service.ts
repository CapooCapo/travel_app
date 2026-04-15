import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
import { SendMessageRequest, SendLocationMessageRequest, CreateChatRequest } from "../dto/messaging/message.DTO";
import { UserDTO } from "../dto/auth/user.DTO";

export const messagingService = {
  async getMe(): Promise<UserDTO | null> {
    const res = await apiRequest.getMe();
    return unwrapResponse(res);
  },

  async getChats() {
    const res = await apiRequest.getChats();
    return unwrapResponse(res) || [];
  },

  async getChatById(chatId: number) {
    const res = await apiRequest.getChatById(chatId);
    return unwrapResponse(res);
  },

  async getOrCreatePrivateChat(targetUserId: number) {
    console.log(`[MessagingService] Getting or creating private chat with user: ${targetUserId}`);
    const res = await apiRequest.createChat(targetUserId);
    return unwrapResponse(res);
  },

  async createChat(targetUserId: number) {
    const res = await apiRequest.createChat(targetUserId);
    return unwrapResponse(res);
  },

  async createGroupChat(name: string, memberIds: number[]) {
    const res = await apiRequest.createGroupChat({ name, memberIds });
    return unwrapResponse(res);
  },

  async getMessages(chatId: number, page: number = 1) {
    const res = await apiRequest.getMessages(chatId, page);
    return unwrapResponse(res) || [];
  },

  /**
   * Refactored: Implementation of Flattened Payload Strategy.
   * Promotes location data to root-level keys and removes stringified JSON wrappers.
   */
  async sendMessage(req: SendMessageRequest | SendLocationMessageRequest) {
    if (req.type === 'TEXT' && !req.content?.trim())
      throw new Error("Message cannot be empty");
    
    // 🧱 Build base payload
    let payload: any = { ...req };
    
    // 📍 Explicit Location Flattening
    if (req.type === 'LOCATION') {
      const locReq = req as SendLocationMessageRequest;
      
      // Promote properties to root level as expected by Spring Boot DTO
      payload.latitude = locReq.latitude;
      payload.longitude = locReq.longitude;
      payload.placeName = locReq.placeName;
      
      // 🛡️ Remove any stringified nesting or legacy 'location' objects
      if (typeof payload.content === 'string' && payload.content.startsWith('{')) {
        console.log("[MessagingService] Detected stringified JSON in content, un-wrapping...");
      }
      
      // Override content with a clean string to satisfy NOT NULL constraints
      payload.content = `Location: ${locReq.placeName}`;
      
      // Final prune of internal location markers if any
      delete payload.location; 
    }

    const res = await apiRequest.sendMessage(payload);
    return unwrapResponse(res);
  },

  async pinMessage(chatId: number, messageId: number) {
    const res = await apiRequest.pinMessage(chatId, messageId);
    unwrapResponse(res);
  },
};
