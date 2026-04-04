import { Share, Platform } from "react-native";
import { TravelScheduleDTO } from "../dto/schedule/schedule.DTO";

export const ShareService = {
  /**
   * Format and share a list of travel schedules
   */
  async shareSchedules(schedules: TravelScheduleDTO[]) {
    if (schedules.length === 0) return;

    let message = "✈️ *My Upcoming Travel Plans*:\n\n";
    schedules.forEach((item) => {
      message += `📅 ${item.scheduledDate}: ${item.locationName}\n`;
      if (item.notes) {
        message += `📝 Notes: ${item.notes}\n`;
      }
      message += "---\n";
    });

    message += "\n🌍 View details in ExploreEase: mobileapp://schedule";

    try {
      await Share.share({
        title: "My Travel Schedule",
        message: message,
        url: Platform.OS === "ios" ? "mobileapp://schedule" : undefined,
      });
    } catch (error) {
      console.error("Error sharing schedule:", error);
    }
  },

  /**
   * Format and share the unified calendar agenda
   */
  async shareCalendar(calendarEvents: any[]) {
    if (calendarEvents.length === 0) return;

    let message = "📅 *My Travel Agenda*:\n\n";
    
    // Sort events by date if not already
    const sortedEvents = [...calendarEvents].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedEvents.forEach((event) => {
      message += `📌 ${event.date}\n`;
      message += `📍 ${event.title}\n`;
      if (event.time) message += `⏰ ${event.time}\n`;
      if (event.description) message += `ℹ️ ${event.description}\n`;
      message += "\n";
    });

    message += "🌍 Shared from ExploreEase: mobileapp://calendar";

    try {
      await Share.share({
        title: "My Travel Agenda",
        message: message,
        url: Platform.OS === "ios" ? "mobileapp://calendar" : undefined,
      });
    } catch (error) {
      console.error("Error sharing calendar:", error);
    }
  }
};
