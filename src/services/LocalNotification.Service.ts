import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { TravelScheduleDTO } from "../dto/schedule/schedule.DTO";

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Added missing required property
    shouldShowList: true,   // Added missing required property
  }),
});

export const LocalNotificationService = {
  /**
   * Request permissions from the user
   */
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return false;
    }
    
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    
    return true;
  },

  /**
   * Schedule a travel reminder 24 hours before the activity
   */
  async scheduleTravelReminder(schedule: TravelScheduleDTO) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    // schedule.scheduledDate is in YYYY-MM-DD format
    const targetDate = new Date(schedule.scheduledDate);
    // Set to start of day (00:00:00)
    targetDate.setHours(0, 0, 0, 0);

    // Reminder time: 24 hours before (minus 1 day)
    const triggerDate = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000);
    const now = new Date();

    // If the activity is already less than 24 hours away, 
    // or past the trigger time, schedule for "now + 5 seconds" as a confirmation.
    let trigger: Date = triggerDate;
    if (triggerDate <= now) {
        // If the activity itself is in the past, don't schedule
        if (targetDate <= now) return null;
        // Otherwise, notify shortly after scheduling (e.g., 5 seconds)
        trigger = new Date(now.getTime() + 5000);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Activity Tomorrow!",
        body: `Don't forget your visit to ${schedule.locationName}.`,
        data: { scheduleId: schedule.id },
      },
      trigger: {
        date: trigger,
      },
    });

    console.log(`Scheduled notification ${notificationId} for ${trigger}`);
    return notificationId;
  },

  /**
   * Cancel a specific scheduled notification
   */
  async cancelNotification(id: string) {
    await Notifications.cancelScheduledNotificationAsync(id);
  },

  /**
   * Cancel all scheduled notifications (utility)
   */
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
