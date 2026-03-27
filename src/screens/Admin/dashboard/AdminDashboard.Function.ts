import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { apiRequest } from "../../../api/client";
import { EventDTO } from "../../../dto/event/event.DTO";

export function AdminDashboardFunction() {
  const [pendingEvents, setPendingEvents] = useState<EventDTO[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "analytics">("events");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, analyticsRes] = await Promise.allSettled([
        apiRequest.adminGetPendingEvents(),
        apiRequest.adminGetAnalytics(),
      ]);
      if (eventsRes.status === "fulfilled")
        setPendingEvents(eventsRes.value.data?.data?.events ?? []);
      if (analyticsRes.status === "fulfilled")
        setAnalytics(analyticsRes.value.data?.data ?? null);
    } catch {
      // Silent
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId: number) => {
    try {
      await apiRequest.adminApproveEvent(eventId);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventId));
      Alert.alert("Approved", "Event is now live.");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to approve");
    }
  };

  const handleReject = (eventId: number) => {
    Alert.alert("Reject Event", "Are you sure you want to reject this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            await apiRequest.adminRejectEvent(eventId);
            setPendingEvents((prev) => prev.filter((e) => e.id !== eventId));
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Failed to reject");
          }
        },
      },
    ]);
  };

  return {
    pendingEvents, analytics, isLoading,
    activeTab, setActiveTab,
    handleApprove, handleReject, loadData,
  };
}
