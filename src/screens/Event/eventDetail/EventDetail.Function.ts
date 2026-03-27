import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { eventService } from "../../../services/event.service";
import { EventDTO } from "../../../dto/event/event.DTO";

export function EventDetailFunction(navigation: any, eventId: number) {
  const [event, setEvent] = useState<EventDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!event || event.status !== "incoming") return;
    const interval = setInterval(() => {
      const diff = new Date(event.startDate).getTime() - Date.now();
      if (diff <= 0) { setCountdown("Starting now!"); clearInterval(interval); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${d}d ${h}h ${m}m`);
    }, 60000);
    return () => clearInterval(interval);
  }, [event]);

  const loadEvent = async () => {
    setIsLoading(true);
    try {
      const res = await eventService.getEventById(eventId);
      setEvent(res ?? null);
      setIsBookmarked(res?.isBookmarked ?? false);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!event) return;
    try {
      await eventService.toggleBookmark(event.id, !isBookmarked);
      setIsBookmarked(!isBookmarked);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Bookmark failed");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Event", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await eventService.deleteEvent(eventId);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Failed to delete");
          }
        },
      },
    ]);
  };

  return {
    event, isLoading, isBookmarked, countdown,
    handleToggleBookmark, handleDelete,
    goBack: () => navigation.goBack(),
  };
}
