export type MessageDTO = {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'EMOJI' | 'LOCATION';
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  isRead: boolean;
};

export type SendMessageRequest = {
  chatRoomId: number;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'EMOJI' | 'LOCATION';
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
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


export type CreateChatRequest = {
  type: 'one_to_one' | 'group';
  participantIds: number[];
  name?: string;
  eventId?: number;
};
