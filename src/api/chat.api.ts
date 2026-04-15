import http from "../utils/http";
import { Res } from "../dto/format";
import { NotificationResponse } from "../dto/notification/notification.DTO";

export const chatApi = {
  getChats() {
    return http.get<Res<any>>("/api/messaging/rooms")
      .then(res => res.data);
  },
  getChatById(id: number) {
    return http.get<Res<any>>(`/api/messaging/rooms/${id}`)
      .then(res => res.data);
  },
  createChat(targetUserId: number) {
    return http.post<Res<any>>("/api/messaging/rooms", targetUserId)
      .then(res => res.data);
  },
  createGroupChat(req: { name: string, memberIds: number[] }) {
    return http.post<Res<any>>("/api/messaging/rooms/group", req)
      .then(res => res.data);
  },
  getMessages(chatRoomId: number, page: number = 1) {
    return http.get<Res<any>>(`/api/messaging/rooms/${chatRoomId}/messages`, { params: { page } })
      .then(res => res.data);
  },
  sendMessage(req: any) {
    return http.post<Res<any>>("/api/messaging/messages", req)
      .then(res => res.data);
  },
  pinMessage(chatRoomId: number, messageId: number) {
    return http.post<Res<any>>(`/api/messaging/rooms/${chatRoomId}/messages/${messageId}/pin`)
      .then(res => res.data);
  },
  getNotifications() {
    return http.get<Res<NotificationResponse[]>>("/api/notifications")
      .then(res => res.data);
  },
};
