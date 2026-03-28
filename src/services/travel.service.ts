import api from "../api/client";
import { saveOffline, getOffline, OfflineAttraction } from "../storage/offline.storage";

export interface Attraction {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  images: string[];
}

export type AttractionSource = "online" | "offline" | "empty";

export interface AttractionsResult {
  data: Attraction[];
  source: AttractionSource;
}

const DEFAULT_LOCATION = { lat: 10.7769, lon: 106.7009 }; // Ho Chi Minh City

export async function getNearbyAttractions(
  lat: number | null,
  lon: number | null
): Promise<AttractionsResult> {
  const resolvedLat = lat ?? DEFAULT_LOCATION.lat;
  const resolvedLon = lon ?? DEFAULT_LOCATION.lon;

  try {
    const res = await api.get<Attraction[]>("/attractions/nearby", {
      params: { lat: resolvedLat, lon: resolvedLon },
    });

    const attractions = res.data;
    await saveOffline(attractions as OfflineAttraction[]);

    return { data: attractions, source: "online" };
  } catch (e) {
    const cached = await getOffline();
    if (cached.length > 0) {
      return { data: cached, source: "offline" };
    }
    return { data: [], source: "empty" };
  }
}
