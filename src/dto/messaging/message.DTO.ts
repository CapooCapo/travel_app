export type MessageDTO = {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'EMOJI' | 'LOCATION' | 'SYSTEM';
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt: string;
  isRead: boolean;
};

export interface SendLocationMessageRequest extends SendMessageRequest {
  type: 'LOCATION';
  latitude: number;
  longitude: number;
  placeName: string;
  placeId?: string;
}

export type SendMessageRequest = {
  chatRoomId: number;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'EMOJI' | 'LOCATION' | 'SYSTEM';
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  placeName?: string;
  placeId?: string;
};

export type ChatDTO = {
  id: number;
  type: 'PRIVATE' | 'GROUP';
  name?: string;
  participants: ChatParticipantDTO[];
  lastMessage?: MessageDTO;
  unreadCount: number;
  eventId?: number;
  pinnedMessage?: MessageDTO;
};

export type ChatParticipantDTO = {
  id: number;
  fullName: string;
  avatarUrl?: string;
  role: 'member' | 'organizer';
};


export type CreateChatRequest = {
  type: 'one_to_one' | 'group';
  participantIds: number[];
  name?: string;
  eventId?: number;
};
