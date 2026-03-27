export type MessageDTO = {
  id: number;
  chatId: number;
  senderId: number;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'location';
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  isRead: boolean;
};

export type ChatDTO = {
  id: number;
  type: 'one_to_one' | 'group';
  name?: string;
  participants: ChatParticipantDTO[];
  lastMessage?: MessageDTO;
  unreadCount: number;
  eventId?: number;
  pinnedMessage?: MessageDTO;
};

export type ChatParticipantDTO = {
  userId: number;
  userName: string;
  avatarUrl?: string;
  role: 'member' | 'organizer';
};

export type SendMessageRequest = {
  chatId: number;
  content: string;
  type: 'text' | 'image' | 'location';
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
};

export type CreateChatRequest = {
  type: 'one_to_one' | 'group';
  participantIds: number[];
  name?: string;
  eventId?: number;
};
