/**
 * BE không có endpoint GET /api/events/{id}.
 * EventDTO được truyền toàn bộ qua navigation params.
 * route.params = { event: EventDTO }
 */
import { useState, useEffect } from "react";
import { EventDTO } from "../../../dto/event/event.DTO";

export function useEventDetail(navigation: any, event: EventDTO) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!event || event.status !== "incoming") return;

    // Tính countdown ngay lập tức
    updateCountdown();
    const interval = setInterval(updateCountdown, 60_000);
    return () => clearInterval(interval);
  }, [event]);

  const updateCountdown = () => {
    const diff = new Date(event.startDate).getTime() - Date.now();
    if (diff <= 0) {
      setCountdown("Starting now!");
      return;
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    setCountdown(`${d}d ${h}h ${m}m`);
  };

  const goBack = () => navigation.goBack();

  return { countdown, goBack };
}
