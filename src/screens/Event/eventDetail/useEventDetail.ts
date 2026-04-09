import { useState, useEffect, useCallback } from "react";
import { Share, Alert, Linking, Platform } from "react-native";
import { EventResponse } from "../../../dto/event/event.DTO";
import { eventService } from "../../../services/event.service";

export function useEventDetail(navigation: any, eventId?: number, initialEvent?: EventResponse) {
  const [event, setEvent] = useState<EventResponse | undefined>(initialEvent);
  const [countdown, setCountdown] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(initialEvent?.isBookmarked || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const fetchEventDetail = useCallback(async (id: number) => {
    setIsFetchingDetail(true);
    try {
      console.log(`[EventDetail] Fetching event ${id}...`);
      const data = await eventService.getEventById(id);
      setEvent(data);
      setIsBookmarked(data.isBookmarked || false);
    } catch (error: any) {
      console.error("[EventDetail] Fetch error:", error);
      // Don't alert if we already have initialEvent, just log it.
      if (!event) {
        Alert.alert("Error", "Could not load event details.");
      }
    } finally {
      setIsFetchingDetail(false);
    }
  }, [event]);

  useEffect(() => {
    if (!event && eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId, event, fetchEventDetail]);

  useEffect(() => {
    if (!event || event.status !== "INCOMING") return;

    updateCountdown();
    const interval = setInterval(updateCountdown, 60_000);
    return () => clearInterval(interval);
  }, [event]);

  const updateCountdown = () => {
    if (!event) return;
    const diff = new Date(event.startTime).getTime() - Date.now();
    if (diff <= 0) {
      setCountdown("Starting now!");
      return;
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    setCountdown(`${d}d ${h}h ${m}m`);
  };

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        title: event.title,
        message: `Check out this event: ${event.title}\nAt: ${event.address}\nTime: ${new Date(event.startTime).toLocaleString()}`,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const toggleBookmark = async () => {
    if (!event || isLoading) return;
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await eventService.unbookmarkEvent(event.id);
        setIsBookmarked(false);
      } else {
        await eventService.bookmarkEvent(event.id);
        setIsBookmarked(true);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  const openInMaps = () => {
    if (!event) return;
    // Fallback coordinates if the event doesn't have explicit lat/lng but has an address
    // Though usually events have coordinates in this app.
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const latLng = `${event.latitude},${event.longitude}`;
    const label = event.title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to google maps web URL
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
          Linking.openURL(webUrl);
        }
      });
    }
  };

  return { 
    event,
    countdown, 
    isBookmarked, 
    isLoading, 
    isFetchingDetail,
    toggleBookmark, 
    handleShare, 
    openInMaps,
    goBack: () => navigation.goBack() 
  };
}
