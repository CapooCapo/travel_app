import { useState, useEffect, useCallback } from "react";
import { discoveryService } from "../../../services/discovery.service";
import { eventService } from "../../../services/event.service";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { EventDTO } from "../../../dto/event/event.DTO";

export function HomeFunction(navigation: any) {
  const [featuredPlaces, setFeaturedPlaces]   = useState<PlaceDTO[]>([]);
  const [upcomingEvents, setUpcomingEvents]   = useState<EventDTO[]>([]);
  const [isLoading,       setIsLoading]       = useState(false);

  const loadHomeData = useCallback(async () => {
  setIsLoading(true);
  try {
    const places = await discoveryService.getPopular();
    setFeaturedPlaces(places ?? []);

    // Nếu muốn giữ events
    if (places.length > 0) {
      try {
        const res = await eventService.getEventsByAttraction(places[0].id);
        setUpcomingEvents(res.events ?? []);
      } catch {
        setUpcomingEvents([]);
      }
    } else {
      setUpcomingEvents([]);
    }

  } catch {
    setFeaturedPlaces([]);
    setUpcomingEvents([]);
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    loadHomeData();
  }, []);

  return {
    featuredPlaces,
    upcomingEvents,
    isLoading,
    loadHomeData,
    navigateToExplore:      () => navigation.navigate("Explore"),
    navigateToEventList:    () => navigation.navigate("Events"),
    navigateToPlaceDetail:  (placeId: number) => navigation.navigate("PlaceDetail", { placeId }),
    navigateToEventDetail:  (eventId: number) => navigation.navigate("EventDetail", { eventId }),
    navigateToItinerary:    () => navigation.navigate("Itinerary"),
    navigateToAdmin:        () => navigation.navigate("AdminDashboard"),
  };
}
