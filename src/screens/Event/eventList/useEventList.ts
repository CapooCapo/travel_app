/**
 * BE không có endpoint list toàn bộ events.
 * Events luôn gắn với location:
 *   GET /api/events/location/{locationId}
 *
 * Chiến lược:
 * 1. Lấy danh sách popular locations (có pagination)
 * 2. Click vào location → xem events của nó (PlaceDetail → tab Events)
 *
 * EventList screen hoạt động như một "Location Events Browser":
 * - Hiển thị popular locations
 * - Mỗi card có số events
 * - Bấm → PlaceDetail mở tab "events" tự động
 */

import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { discoveryService } from "../../../services/discovery.service";
import { eventService } from "../../../services/event.service";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { EventDTO } from "../../../dto/event/event.DTO";

export type LocationWithEvents = PlaceDTO & {
  events: EventDTO[];
  eventsLoaded: boolean;
};

const PAGE_SIZE = 8;

export function useEventList(navigation: any) {
  const [locations,  setLocations]  = useState<LocationWithEvents[]>([]);
  const [isLoading,    setIsLoading]    = useState(false);
  const [page,         setPage]         = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);

  const hasMore = page < totalPages - 1;

  useEffect(() => {
    fetchLocations(true);
  }, []);

  const fetchLocations = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const currentPage = reset ? 0 : page;
        const res = await discoveryService.getPopular(currentPage, PAGE_SIZE);
        const withEvents: LocationWithEvents[] = res.map((a) => ({
          ...a,
          events: [],
          eventsLoaded: false,
        }));

        setLocations(reset ? withEvents : (prev) => [...prev, ...withEvents]);
        setPage(currentPage + 1);
        // getPopular không trả totalPages — heuristic: có thêm nếu đủ PAGE_SIZE
        setTotalPages(res.length === PAGE_SIZE ? currentPage + 2 : currentPage + 1);

        // Load events cho các locations vừa fetch (background)
        loadEventsForLocations(withEvents, reset);
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load");
      } finally {
        setIsLoading(false);
      }
    },
    [page, isLoading]
  );

  const loadEventsForLocations = async (
    items: LocationWithEvents[],
    reset: boolean
  ) => {
    const results = await Promise.allSettled(
      items.map((a) => eventService.getEventsByLocation(a.id, 0, 3))
    );

    setLocations((prev) => {
      const updated = reset
        ? [...items]
        : [...prev.slice(0, prev.length - items.length), ...items];

      results.forEach((r, idx) => {
        if (r.status === "fulfilled") {
          updated[reset ? idx : prev.length - items.length + idx] = {
            ...updated[reset ? idx : prev.length - items.length + idx],
            events: r.value.events,
            eventsLoaded: true,
          };
        }
      });
      return [...updated];
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) fetchLocations(false);
  };

  // Navigate to PlaceDetail và mở tab events tự động
  const navigateToPlaceEvents = (placeId: number) =>
    navigation.navigate("PlaceDetail", { placeId, initialTab: "events" });

  // Navigate to EventDetail (pass event object — BE không có GET /events/{id})
  const navigateToEventDetail = (event: EventDTO) =>
    navigation.navigate("EventDetail", { event });

  return {
    locations,
    isLoading,
    hasMore,
    handleLoadMore,
    navigateToPlaceEvents,
    navigateToEventDetail,
    refresh: () => fetchLocations(true),
  };
}
