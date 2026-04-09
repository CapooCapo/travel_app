import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { eventService } from "../../../services/event.service";
import { EventResponse, EventFilterParams } from "../../../dto/event/event.DTO";

const PAGE_SIZE = 10;

export function useExploreEvents() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'INCOMING' | 'ONGOING' | 'COMPLETED'>('INCOMING');
  
  // Filters
  const [filters, setFilters] = useState<EventFilterParams>({
    keyword: "",
    category: "",
    isFree: false,
    radius: 10,
  });

  const fetchEvents = useCallback(async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const params: EventFilterParams = {
        ...filters,
        status: activeTab,
        page: currentPage,
        size: PAGE_SIZE,
      };

      const res = await eventService.getEvents(params);
      const newEvents = res.content || [];
      console.log(`[ExploreEvents] Fetched ${newEvents.length} events (Page: ${currentPage})`);

      setEvents(reset ? newEvents : (prev) => [...prev, ...newEvents]);
      setPage(currentPage + 1);
      setTotalPages(res.totalPages || 1);
    } catch (error: any) {
      console.error("[ExploreEvents] Error fetching events:", error);
      Alert.alert("Error", error?.message || "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, filters, activeTab]);

  useEffect(() => {
    fetchEvents(true);
  }, [activeTab]);

  const handleSearch = (text: string) => {
    setFilters(prev => ({ ...prev, keyword: text }));
    // In actual app, use debounce for fetchEvents(true)
  };

  const applyFilters = (newFilters: Partial<EventFilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchEvents(true);
  };

  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      fetchEvents(false);
    }
  };

  return {
    events,
    isLoading,
    activeTab,
    setActiveTab,
    filters,
    handleSearch,
    applyFilters,
    loadMore,
    refresh: () => fetchEvents(true)
  };
}
