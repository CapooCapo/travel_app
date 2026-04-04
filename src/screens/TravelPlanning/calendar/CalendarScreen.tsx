import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSchedule } from "../../../context/ScheduleContext";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { ShareService } from "../../../services/ShareService";

const CalendarScreen = () => {
  const navigation = useNavigation<any>();
  const { calendarEvents, isLoading, fetchCalendar } = useSchedule();

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const renderEvent = ({ item }: { item: any }) => {
    const isItinerary = item.type === "ITINERARY";
    
    return (
      <View style={styles.eventCard}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={[styles.indicator, { backgroundColor: isItinerary ? COLORS.primary : "#10B981" }]} />
        </View>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventLocation}>
            <Ionicons name="location-outline" size={14} color={COLORS.muted} /> {item.locationName}
          </Text>
          {item.description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderSectionHeader = (date: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {new Date(date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </Text>
    </View>
  );

  // Simple grouping logic for the agenda view
  const groupedEvents = (calendarEvents || []).reduce((acc: any, event: any) => {
    const date = event.startTime.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  const sections = Object.keys(groupedEvents).sort().map(date => ({
    date,
    data: groupedEvents[date]
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Calendar</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => ShareService.shareCalendar(calendarEvents)} style={{ marginRight: 15 }}>
            <Ionicons name="share-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => fetchCalendar()}>
            <Ionicons name="refresh" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View>
            {renderSectionHeader(item.date)}
            {item.data.map((event: any, index: number) => (
              <React.Fragment key={event.id || index}>
                {renderEvent({ item: event })}
              </React.Fragment>
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-clear-outline" size={64} color={COLORS.muted} />
              <Text style={styles.emptyText}>No plans found</Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate("Discovery")}
              >
                <Text style={styles.exploreButtonText}>Explore Attractions</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        onRefresh={fetchCalendar}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  listContent: { paddingBottom: 40 },
  sectionHeader: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  eventCard: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timeContainer: {
    width: 70,
    alignItems: "flex-end",
    paddingRight: 15,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  indicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginTop: 4,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    ...FONTS.body1,
    color: COLORS.muted,
    marginTop: 20,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default CalendarScreen;
