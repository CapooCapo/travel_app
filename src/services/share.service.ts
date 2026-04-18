import { Share, Alert } from 'react-native';
import { messagingService } from './messaging.service';

export interface ShareObject {
  id: number;
  type: 'place' | 'event';
  name: string;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export const shareService = {
  /**
   * Share to internal chat
   */
  async shareToChat(chatId: number, item: ShareObject) {
    try {
      const shareData = {
        type: 'LOCATION',
        locationId: item.id,
        itemType: item.type,
        name: item.name,
        imageUrl: item.imageUrl,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address
      };

      await messagingService.sendMessage({
        chatRoomId: chatId,
        content: JSON.stringify(shareData),
        type: 'LOCATION',
        latitude: item.latitude,
        longitude: item.longitude,
        placeName: item.name
      });

      return true;
    } catch (error: any) {
      Alert.alert("Share Error", error?.message || "Failed to share to chat");
      return false;
    }
  },

  /**
   * Share to external platforms
   */
  async shareExternal(item: ShareObject) {
    try {
      const deepLink = `travelapp://${item.type}/${item.id}`;
      const message = `Check out this ${item.type}: ${item.name}\n${item.description || ''}\n\nView details: ${deepLink}`;

      const result = await Share.share({
        title: item.name,
        message: message,
        url: deepLink, // iOS specific
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }
};
