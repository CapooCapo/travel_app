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
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // 1. Hàm lấy GPS đã được tối ưu cho máy thật
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Quyền truy cập vị trí bị từ chối");
        return null;
      }

      // Thử lấy vị trí hiện tại (mức độ Balanced)
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(() => null);

      // Nếu không bắt được tín hiệu, lấy vị trí cũ gần nhất
      if (!currentLocation) {
        currentLocation = await Location.getLastKnownPositionAsync({});
      }

      if (currentLocation) {
        setLocation(currentLocation);
        return currentLocation;
      } else {
        console.warn("Không thể định vị được thiết bị");
        return null;
      }
    } catch (error) {
      console.error("Lỗi lấy GPS:", error);
      return null;
    }
  };

  // 2. Logic load dữ liệu gộp chung với GPS
  const loadHomeData = useCallback(async () => {
    setIsLoading(true);
    try {
      // GỌI HÀM LẤY GPS XỊN VỪA VIẾT Ở TRÊN
      const currLoc = await requestLocationPermission();

      // Nếu có tọa độ thì mới gọi API Gemini
      if (currLoc) {
        const places = await discoveryService.getAiRecommendations(
          currLoc.coords.latitude,
          currLoc.coords.longitude,
        );

        setFeaturedPlaces(places ?? []);

        // Lấy sự kiện của địa điểm top 1
        if (places && places.length > 0) {
          try {
            const eventRes = await eventService.getEventsByAttraction(
              places[0].attraction.id,
            );
            setUpcomingEvents(eventRes.events ?? []);
          } catch {
            setUpcomingEvents([]);
          }
        }
      }
    } catch (error) {
      console.error("Lỗi load data:", error);
      setFeaturedPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. CHỈ DÙNG 1 useEffect DUY NHẤT để tránh lặp vô tận
  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  return {
    featuredPlaces,
    upcomingEvents,
    isLoading,
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
