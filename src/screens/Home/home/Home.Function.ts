import { useState, useEffect, useCallback } from "react";
import { discoveryService } from "../../../services/discovery.service";
import { eventService } from "../../../services/event.service";
import { EventDTO } from "../../../dto/event/event.DTO";
import * as Location from "expo-location";
import { AiRecommendationDTO } from "../../../dto/ai/ai.DTO";

export function HomeFunction(navigation: any) {
  const [featuredPlaces, setFeaturedPlaces] = useState<AiRecommendationDTO[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State mới để báo cáo tiến trình
  const [loadingStep, setLoadingStep] = useState<string>("Đang chuẩn bị...");

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;

      let location = null;
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        location = await Location.getLastKnownPositionAsync();
      }
      return location?.coords ? location : null;
    } catch (err) {
      return null;
    }
  };

  const loadHomeData = useCallback(async () => {
    setIsLoading(true);

    try {
      setLoadingStep("📍 Đang lấy tọa độ GPS...");
      const currLoc = await requestLocationPermission();

      if (!currLoc?.coords) {
        setFeaturedPlaces([]);
        return;
      }

      setLoadingStep("✨ AI đang phân tích sở thích & tìm kiếm quanh bạn...");
      const { latitude, longitude } = currLoc.coords;

      const places = await discoveryService.getAiRecommendations(
        latitude,
        longitude,
      );

      setFeaturedPlaces(places ?? []);

      if (places?.length > 0) {
        setLoadingStep("📅 Đang tải sự kiện lân cận...");
        try {
          // Lấy attraction.id từ phần tử đầu tiên của mảng AI trả về
          const eventRes = await eventService.getEventsByAttraction(
            places[0].attraction.id,
          );
          setUpcomingEvents(eventRes.events ?? []);
        } catch {
            setUpcomingEvents([]);
        }
      }
    } catch (error) {
      console.error("Load data lỗi:", error);
      setFeaturedPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  return {
    featuredPlaces,
    upcomingEvents,
    isLoading,
    loadingStep, // Trả ra UI
    loadHomeData,
    navigateToExplore: () => navigation.navigate("Explore"),
    navigateToEventList: () => navigation.navigate("Events"),
    navigateToPlaceDetail: (placeId: number) =>
      navigation.navigate("PlaceDetail", { placeId }),
    navigateToEventDetail: (eventId: number) =>
      navigation.navigate("EventDetail", { eventId }),
    navigateToItinerary: () => navigation.navigate("Itinerary"),
    navigateToAdmin: () => navigation.navigate("AdminDashboard"),
  };
}
