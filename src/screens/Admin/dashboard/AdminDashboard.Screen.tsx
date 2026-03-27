import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, ScrollView, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AdminDashboardFunction } from "./AdminDashboard.Function";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";
import { StyleSheet } from "react-native";
import { EventDTO } from "../../../dto/event/event.DTO";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  headerSub: { ...FONTS.body2, color: COLORS.muted, marginTop: 2 },

  tabRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: COLORS.border, marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 11, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderColor: COLORS.primary },
  tabText: { ...FONTS.body2, color: COLORS.muted },
  tabTextActive: { color: COLORS.primary, fontWeight: "700" },

  // Event approval card
  eventCard: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding, marginBottom: 10,
    padding: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  eventTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 4 },
  eventMeta: { ...FONTS.body2, color: COLORS.muted, marginBottom: 10 },
  actionRow: { flexDirection: "row", gap: 10 },
  approveBtn: {
    flex: 1, backgroundColor: "#00c864", borderRadius: SIZES.radius - 2,
    paddingVertical: 9, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 5,
  },
  rejectBtn: {
    flex: 1, backgroundColor: COLORS.danger + "22",
    borderRadius: SIZES.radius - 2,
    paddingVertical: 9, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 5,
    borderWidth: 1, borderColor: COLORS.danger + "55",
  },
  approveBtnText: { ...FONTS.body2, color: "#fff", fontWeight: "700" },
  rejectBtnText: { ...FONTS.body2, color: COLORS.danger, fontWeight: "700" },

  // Analytics
  analyticsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: SIZES.padding, gap: 10, marginTop: 6 },
  statCard: {
    width: "47%", backgroundColor: COLORS.card,
    borderRadius: SIZES.radius, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { ...FONTS.h2, color: COLORS.text, fontWeight: "800", marginBottom: 4 },
  statLabel: { ...FONTS.body2, color: COLORS.muted },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 8 },
  listContent: { paddingBottom: 32 },
});

const AdminDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    pendingEvents, analytics, isLoading,
    activeTab, setActiveTab,
    handleApprove, handleReject, loadData,
  } = AdminDashboardFunction();

  const renderEventCard = ({ item }: { item: EventDTO }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.eventMeta}>
        {item.address}  ·  {new Date(item.startDate).toLocaleDateString()}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
          <Text style={styles.approveBtnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
          <Ionicons name="close-circle-outline" size={16} color={COLORS.danger} />
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const STAT_ITEMS = [
    { label: "Total Users",     value: analytics?.totalUsers    ?? "—", icon: "people-outline" },
    { label: "Active Events",   value: analytics?.activeEvents  ?? "—", icon: "calendar-outline" },
    { label: "Top Place",       value: analytics?.topPlace      ?? "—", icon: "location-outline" },
    { label: "Reviews Today",   value: analytics?.reviewsToday  ?? "—", icon: "star-outline" },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSub}>Manage events, content & analytics</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["events", "analytics"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "events"
                ? `Pending Events${pendingEvents.length > 0 ? ` (${pendingEvents.length})` : ""}`
                : "Analytics"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />
      ) : activeTab === "events" ? (
        <FlatList
          data={pendingEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => `admin-event-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadData} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No pending events</Text>
            </View>
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadData} tintColor={COLORS.primary} />
          }
        >
          <View style={styles.analyticsGrid}>
            {STAT_ITEMS.map(({ label, value, icon }) => (
              <View key={label} style={styles.statCard}>
                <Ionicons name={icon as any} size={20} color={COLORS.primary} style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>{String(value)}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AdminDashboardScreen;
