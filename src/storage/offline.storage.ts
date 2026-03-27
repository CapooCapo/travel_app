import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlaceDTO } from "../dto/discovery/place.DTO";
import { EventDTO } from "../dto/event/event.DTO";

const KEYS = {
  BOOKMARKED_PLACES: "OFFLINE_BOOKMARKED_PLACES",
  BOOKMARKED_EVENTS: "OFFLINE_BOOKMARKED_EVENTS",
  RECENT_SEARCHES: "OFFLINE_RECENT_SEARCHES",
};

export const offlineStorage = {
  async savePlaces(places: PlaceDTO[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.BOOKMARKED_PLACES, JSON.stringify(places));
  },

  async getPlaces(): Promise<PlaceDTO[]> {
    const raw = await AsyncStorage.getItem(KEYS.BOOKMARKED_PLACES);
    return raw ? JSON.parse(raw) : [];
  },

  async saveEvents(events: EventDTO[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.BOOKMARKED_EVENTS, JSON.stringify(events));
  },

  async getEvents(): Promise<EventDTO[]> {
    const raw = await AsyncStorage.getItem(KEYS.BOOKMARKED_EVENTS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveRecentSearch(keyword: string): Promise<void> {
    const existing = await offlineStorage.getRecentSearches();
    const updated = [keyword, ...existing.filter((k) => k !== keyword)].slice(0, 10);
    await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  },

  async getRecentSearches(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
    return raw ? JSON.parse(raw) : [];
  },

  async clearRecentSearches(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
