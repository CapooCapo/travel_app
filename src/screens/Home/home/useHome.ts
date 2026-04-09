import { useState, useEffect, useCallback, useContext } from "react";
import { discoveryService } from "../../../services/discovery.service";
import { eventService } from "../../../services/event.service";
import { debugService } from "../../../services/debug.service";
import { EventResponse } from "../../../dto/event/event.DTO";
import * as Location from "expo-location";
import { AiRecommendationDTO } from "../../../dto/ai/ai.DTO";
import { AuthContext } from "../../../context/AuthContext";

export function useHome(navigation: any) {
  const { user } = useContext(AuthContext);
  const [featuredPlaces, setFeaturedPlaces] = useState<AiRecommendationDTO[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State mới để báo cáo tiến trình
  const [loadingStep, setLoadingStep] = useState<string>("Preparing...");

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
      setLoadingStep("📍 Fetching GPS coordinates...");
      const currLoc = await requestLocationPermission();

      if (!currLoc?.coords) {
        setFeaturedPlaces([]);
        return;
      }

      setLoadingStep("✨ AI is analyzing preferences & searching nearby...");
      const { latitude, longitude } = currLoc.coords;



      // [FE DEBUG] Trigger test AI Recommendations via debugService
      debugService.runAiRecommendationTest();

      const places = await discoveryService.getAiRecommendations(
        latitude,
        longitude,
        1 // userId giả định (TODO: mapping Auth)
      );

      setFeaturedPlaces(places ?? []);

      setLoadingStep("📅 Loading nearby events...");
      try {
        const eventRes = await eventService.getEvents({
          lat: latitude,
          lng: longitude,
          radius: 50, // 50km radius for Home screen
        });
        const events = eventRes.content ?? [];
        setUpcomingEvents(events);
        console.log(`[Home] Fetched ${events.length} nearby events (up to 50km)`);
      } catch (err) {
        console.error("[Home] Fetch events error:", err);
        setUpcomingEvents([]);
      }
    } catch (error) {
      console.error("Load data error:", error);
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
    navigateToEventDetail: (event: EventResponse) =>
      navigation.navigate("EventDetail", { event, eventId: event.id }),
    navigateToItinerary: () => navigation.navigate("Itinerary"),
    navigateToAdmin: () => navigation.navigate("AdminDashboard"),
  };
}
