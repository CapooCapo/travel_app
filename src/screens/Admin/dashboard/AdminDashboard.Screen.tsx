import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ScrollView, Animated, Alert, StatusBar
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAdminDashboard, AdminTab } from "./useAdminDashboard";
import { useProfile } from "../../Profile/profile/useProfile";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  headerTitle: { ...FONTS.h2, color: COLORS.text, fontWeight: "800" },
  headerSub: { ...FONTS.body2, color: COLORS.muted, marginTop: 2 },

  tabBarContainer: { backgroundColor: COLORS.bg, borderBottomWidth: 1, borderColor: COLORS.border },
  tabRow: { flexDirection: "row", paddingHorizontal: SIZES.padding - 4 },
  tab: { paddingHorizontal: 16, paddingVertical: 14, alignItems: "center", marginRight: 8 },
  tabActive: { borderBottomWidth: 2, borderColor: COLORS.primary },
  tabText: { ...FONTS.body2, color: COLORS.muted, fontWeight: "600" },
  tabTextActive: { color: COLORS.primary, fontWeight: "800" },

  // Section Styles
  sectionContainer: { flex: 1 },
  listContent: { paddingBottom: 40 },
  
  // Table / Card Styles
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  cardTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", flex: 1 },
  cardMeta: { ...FONTS.body2, color: COLORS.muted, marginBottom: 4 },
  
  // Action Buttons
  actionRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryBtn: {
    flex: 1, backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 10, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 6,
  },
  secondaryBtn: {
    flex: 1, backgroundColor: COLORS.bg, borderRadius: 12,
    paddingVertical: 10, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  dangerBtn: {
    flex: 1, backgroundColor: COLORS.danger + "15", borderRadius: 12,
    paddingVertical: 10, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 6,
    borderWidth: 1, borderColor: COLORS.danger + "30",
  },
  btnText: { ...FONTS.body2, color: "#fff", fontWeight: "700" },
  btnTextOutline: { ...FONTS.body2, color: COLORS.text, fontWeight: "600" },
  btnTextDanger: { ...FONTS.body2, color: COLORS.danger, fontWeight: "700" },

  // Stats
  analyticsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: SIZES.padding, gap: 12, marginTop: 8 },
  statCard: {
    width: (SIZES.width - SIZES.padding * 2 - 12) / 2, 
    backgroundColor: COLORS.card,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { ...FONTS.h2, color: COLORS.text, fontWeight: "800", marginBottom: 4 },
  statLabel: { ...FONTS.body2, color: COLORS.muted },

  // Status Tags
  tag: { 
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, 
    fontSize: 10, fontWeight: "800", textTransform: "uppercase" 
  },
  tagPending: { backgroundColor: "#FFF7ED", color: "#C2410C" },
  tagSuccess: { backgroundColor: "#F0FDF4", color: "#15803D" },

  // Placeholder views
  centerView: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  errorText: { ...FONTS.body1, color: COLORS.danger, textAlign: "center", marginTop: 12 },
  retryBtn: { 
      marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, 
      backgroundColor: COLORS.primary, borderRadius: 12 
  },
  restrictedTitle: { ...FONTS.h2, color: COLORS.text, marginTop: 16, textAlign: "center" },
  restrictedDesc: { ...FONTS.body1, color: COLORS.muted, textAlign: "center", marginTop: 8 },
});

const SkeletonItem = () => {
  const [pulseAnim] = useState(new Animated.Value(0.4));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: pulseAnim }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 16, width: "60%", backgroundColor: COLORS.border, borderRadius: 4, marginBottom: 8 }} />
          <View style={{ height: 12, width: "40%", backgroundColor: COLORS.border, borderRadius: 4 }} />
        </View>
        <View style={{ height: 24, width: 60, backgroundColor: COLORS.border, borderRadius: 4 }} />
      </View>
      <View style={{ height: 12, width: "90%", backgroundColor: COLORS.border, borderRadius: 4, marginTop: 12 }} />
    </Animated.View>
  );
};

const AdminDashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { isAdmin } = useProfile(navigation);
  const {
    sections, activeTab, setActiveTab,
    fetchSection, handleApprove, handleReject, handleResolveReport,
  } = useAdminDashboard();

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centerView]}>
        <Ionicons name="lock-closed-outline" size={80} color={COLORS.muted} />
        <Text style={styles.restrictedTitle}>Access Denied</Text>
        <Text style={styles.restrictedDesc}>
            You do not have administrator permissions to view this page.
        </Text>
      </View>
    );
  }

  const renderSectionContent = () => {
    const section = sections[activeTab];

    if (section.loading) {
      return (
        <ScrollView style={{ flex: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonItem key={i} />
          ))}
        </ScrollView>
      );
    }

    if (section.errorStatus === 403) {
      return (
        <View style={styles.centerView}>
          <Ionicons name="shield-outline" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>You don't have permission to access this page.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchSection(activeTab)}>
            <Text style={[styles.btnText, {color: '#fff'}]}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (section.errorStatus) {
      return (
        <View style={styles.centerView}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>An error occurred, please try again later.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchSection(activeTab)}>
            <Text style={[styles.btnText, {color: '#fff'}]}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === "analytics") {
        return <AnalyticsView data={section.data} onRefresh={() => fetchSection("analytics")} isRefreshing={section.loading} />;
    }

    return (
      <FlatList
        data={section.data}
        renderItem={activeTab === "events" ? renderEventCard : activeTab === "users" ? renderUserCard : renderReportCard}
        keyExtractor={(item) => `admin-${activeTab}-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={section.loading} onRefresh={() => fetchSection(activeTab)} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
            <View style={styles.centerView}>
                <Ionicons name="documents-outline" size={48} color={COLORS.muted} />
                <Text style={styles.headerSub}>No {
                    activeTab === "events" ? "events" : 
                    activeTab === "users" ? "users" : 
                    "reports"
                } found.</Text>
            </View>
        }
      />
    );
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={[styles.tag, styles.tagPending]}>Pending</Text>
      </View>
      <Text style={styles.cardMeta}>📍 {item.locationId ? "Location Set" : "No Location"}</Text>
      <Text style={styles.cardMeta} numberOfLines={2}>📝 {item.description}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => {
            handleApprove(item.id).catch(err => Alert.alert("Error", err.message));
        }}>
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={() => {
            handleReject(item.id).catch(err => Alert.alert("Error", err.message));
        }}>
          <Ionicons name="close" size={18} color={COLORS.danger} />
          <Text style={styles.btnTextDanger}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.fullName}</Text>
        <Text style={[styles.tag, styles.tagSuccess]}>{item.role}</Text>
      </View>
      <Text style={styles.cardMeta}>📧 {item.email}</Text>
      <Text style={styles.cardMeta}>🗺️ Style: {item.travelStyle || "None"}</Text>
    </View>
  );

  const renderReportCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Report: {item.reportedType}</Text>
        <Text style={[styles.tag, styles.tagPending]}>{item.status}</Text>
      </View>
      <Text style={styles.cardMeta}>⚠️ Reason: {item.reason}</Text>
      <Text style={styles.cardMeta}>👤 Reporter: {item.reporterName}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => {
            handleResolveReport(item.id, "RESOLVED").catch(err => Alert.alert("Error", err.message));
        }}>
          <Text style={styles.btnTextOutline}>Resolve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={() => {
            handleResolveReport(item.id, "DISMISSED").catch(err => Alert.alert("Error", err.message));
        }}>
          <Text style={styles.btnTextDanger}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashmin Hub</Text>
        <Text style={styles.headerSub}>Moderation & System Analytics</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
            {(["events", "users", "reports", "analytics"] as AdminTab[]).map((tab) => (
            <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
            >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        {renderSectionContent()}
      </View>
    </View>
  );
};

const AnalyticsView = ({ data, onRefresh, isRefreshing }: { data: any, onRefresh: () => void, isRefreshing: boolean }) => {
    const STAT_ITEMS = [
        { label: "Active Users", value: data?.totalUsers ?? "—", icon: "people" },
        { label: "Live Events", value: data?.totalEvents ?? "—", icon: "calendar" },
        { label: "Pending", value: data?.pendingEvents ?? "—", icon: "time" },
        { label: "Active Reports", value: data?.totalReports ?? "—", icon: "flag" },
    ];

    return (
        <ScrollView 
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            <View style={styles.analyticsGrid}>
                {STAT_ITEMS.map(({ label, value, icon }) => (
                    <View key={label} style={styles.statCard}>
                        <View style={{ backgroundColor: COLORS.primary + "10", alignSelf: 'flex-start', padding: 10, borderRadius: 12, marginBottom: 12 }}>
                            <Ionicons name={icon as any} size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statValue}>{String(value)}</Text>
                        <Text style={styles.statLabel}>{label}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default AdminDashboardScreen;
