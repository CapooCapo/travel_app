import { apiRequest } from '../api/client';
import {
  ItineraryDTO,
  CreateItineraryRequest,
  AddPlanItemRequest,
} from '../dto/travel/travel.DTO';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── NOTIFICATION SETUP ──────────────────────────────────────────────────────

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('itinerary', {
      name: 'Itinerary Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

/**
 * Schedule a local notification 1 day before itinerary start.
 * Cancels any previous notification with the same identifier.
 */
export async function scheduleItineraryReminder(
  itinerary: ItineraryDTO,
): Promise<void> {
  const identifier = `itinerary-${itinerary.id}`;

  // Cancel old notification if exists
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(
    () => {},
  );

  const startDate = new Date(itinerary.startDate);
  const triggerDate = new Date(startDate);
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(8, 0, 0, 0); // 8:00 AM the day before

  if (triggerDate <= new Date()) return; // Already past

  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: '🗺️ Chuyến đi sắp đến!',
      body: `Ngày mai bạn bắt đầu "${itinerary.title}". Hãy chuẩn bị sẵn sàng nhé!`,
      data: { itineraryId: itinerary.id },
      sound: true,
    },
    trigger: {
      date: triggerDate,
      channelId: 'itinerary',
    },
  });
}

export async function cancelItineraryReminder(itineraryId: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    `itinerary-${itineraryId}`,
  ).catch(() => {});
}

// ─── API WRAPPERS ─────────────────────────────────────────────────────────────

export const itineraryService = {
  async getAll(): Promise<ItineraryDTO[]> {
    const res = await apiRequest.getItineraries();
    return res.data.data ?? [];
  },

  async getById(id: number): Promise<ItineraryDTO> {
    const res = await apiRequest.getItineraryById(id);
    return res.data.data;
  },

  async create(req: CreateItineraryRequest): Promise<ItineraryDTO> {
    const res = await apiRequest.createItinerary(req);
    const itinerary = res.data.data;
    await scheduleItineraryReminder(itinerary);
    return itinerary;
  },

  async addItem(itineraryId: number, req: AddPlanItemRequest): Promise<void> {
    await apiRequest.addItineraryItem(itineraryId, req);
  },

  async deleteItem(itineraryId: number, itemId: number): Promise<void> {
    await apiRequest.deleteItineraryItem(itineraryId, itemId);
  },

  async share(id: number): Promise<string> {
    const res = await apiRequest.shareItinerary(id);
    return res.data.data;
  },
};
