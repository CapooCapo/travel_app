import http from "../utils/http";
import { Res } from "../dto/format";
import { NotificationResponse } from "../dto/notification/notification.DTO";

export const chatApi = {
  getChats() {
    return http.get<Res<any>>("/api/messaging/rooms");
  },
  getChatById(id: number) {
    return http.get<Res<any>>(`/api/messaging/rooms/${id}`);
  },
  createChat(targetUserId: number) {
    return http.post<Res<any>>("/api/messaging/rooms", targetUserId);
  },
  createGroupChat(req: { name: string, memberIds: number[] }) {
    return http.post<Res<any>>("/api/messaging/rooms/group", req);
  },
  getMessages(chatRoomId: number, page: number = 1) {
    return http.get<Res<any>>(`/api/messaging/rooms/${chatRoomId}/messages`, { params: { page } });
  },
  sendMessage(req: any) {
    return http.post<Res<any>>("/api/messaging/messages", req);
  },
  pinMessage(chatRoomId: number, messageId: number) {
    return http.post<Res<any>>(`/api/messaging/rooms/${chatRoomId}/messages/${messageId}/pin`);
  },
  getNotifications() {
    return http.get<Res<NotificationResponse[]>>("/api/notifications");
  },
};
