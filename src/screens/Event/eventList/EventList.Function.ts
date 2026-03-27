import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { eventService } from "../../../services/event.service";
import { EventDTO } from "../../../dto/event/event.DTO";

const STATUS_FILTERS = ["all", "incoming", "ongoing", "completed"] as const;

export function EventListFunction(navigation: any) {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>("all");
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const res = await eventService.getEvents({
          keyword: keyword.trim() || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
          isFree: isFreeOnly || undefined,
          page: currentPage,
          limit: 10,
        });
        const newEvents = res?.events ?? [];
        setEvents(reset ? newEvents : (prev) => [...prev, ...newEvents]);
        setPage(currentPage + 1);
        setHasMore(newEvents.length === 10);
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, statusFilter, isFreeOnly, page, isLoading]
  );

  const handleSearch = () => {
    setPage(1);
    fetchEvents(true);
  };

  const handleStatusChange = (s: typeof STATUS_FILTERS[number]) => {
    setStatusFilter(s);
    setPage(1);
    setEvents([]);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) fetchEvents();
  };

  const navigateToDetail = (eventId: number) =>
    navigation.navigate("EventDetail", { eventId });

  const navigateToCreate = () => navigation.navigate("CreateEvent");

  return {
    events, isLoading, keyword, setKeyword,
    statusFilter, isFreeOnly, setIsFreeOnly,
    statusFilters: STATUS_FILTERS,
    handleSearch, handleStatusChange,
    handleLoadMore, navigateToDetail,
    navigateToCreate, fetchEvents,
  };
}
