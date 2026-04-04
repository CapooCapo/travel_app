import AsyncStorage from "@react-native-async-storage/async-storage";

const OFFLINE_KEY = "OFFLINE_ATTRACTIONS";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface OfflineAttraction {
  id: number;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  ratingAverage?: number;
  description: string;
  imageUrls?: string[];
  updatedAt: string;
}

interface OfflineCacheEntry {
  data: OfflineAttraction[];
  savedAt: number;
}

export async function saveOffline(attractions: OfflineAttraction[]): Promise<void> {
  const entry: OfflineCacheEntry = {
    data: attractions.map((a) => ({
      ...a,
      updatedAt: new Date().toISOString(),
    })),
    savedAt: Date.now(),
  };
  await AsyncStorage.setItem(OFFLINE_KEY, JSON.stringify(entry));
}

export async function getOffline(): Promise<OfflineAttraction[]> {
  const raw = await AsyncStorage.getItem(OFFLINE_KEY);
  if (!raw) return [];

  const entry: OfflineCacheEntry = JSON.parse(raw);
  const isExpired = Date.now() - entry.savedAt > TTL_MS;

  if (isExpired) {
    await AsyncStorage.removeItem(OFFLINE_KEY);
    return [];
  }

  return entry.data;
}

export async function clearOffline(): Promise<void> {
  await AsyncStorage.removeItem(OFFLINE_KEY);
}

const RECENT_SEARCHES_KEY = "RECENT_SEARCHES";
const MAX_SEARCHES = 10;

export const offlineStorage = {
  getOffline,
  saveOffline,
  clearOffline,

  async getRecentSearches(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async saveRecentSearch(keyword: string): Promise<void> {
    const searches = await this.getRecentSearches();
    const updated = [keyword, ...searches.filter(s => s !== keyword)].slice(0, MAX_SEARCHES);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }
};
