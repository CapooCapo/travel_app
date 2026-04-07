import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { getNearbyLocations, LocationSource } from "../../services/travel.service";
import { LocationResponse } from "../../dto/discovery/place.DTO";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function LocationScreen() {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [source, setSource] = useState<LocationSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = useCallback(async () => {
    let lat: number | null = null;
    let lng: number | null = null;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      } else {
        Alert.alert(
          "Location Unavailable",
          "Using default city. Grant location access for nearby results."
        );
      }
    } catch {
      // Location failed — fall through to default
    }

    const result = await getNearbyLocations(lat, lng);
    setLocations(result.data);
    setSource(result.source);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchLocations();
      setLoading(false);
    })();
  }, [fetchLocations]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLocations();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Finding locations…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {source === "offline" && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>📶 Showing saved results (offline)</Text>
        </View>
      )}

      <FlatList
        data={locations}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={
          locations.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => <LocationCard location={item} />}
      />
    </View>
  );
}

function LocationCard({ location }: { location: LocationResponse }) {
  const navigation = useNavigation<any>();
  const thumb = location.imageUrls?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => {
        /* Navigate to detail if needed */
      }}
    >
      {thumb ? (
        <Image source={{ uri: thumb }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Text style={styles.cardImagePlaceholderText}>🏛</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {location.name}
          </Text>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => navigation.navigate("Schedule", { location })}
          >
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {location.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🗺</Text>
      <Text style={styles.emptyTitle}>No locations found</Text>
      <Text style={styles.emptySubtitle}>
        Check your connection or try again later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: "#64748B", fontSize: 14 },

  offlineBanner: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  offlineBannerText: { color: "#92400E", fontSize: 13, fontWeight: "500" },

  listContent: { padding: 16, gap: 12 },
  emptyContainer: { flex: 1 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom: 12,
  },
  cardImage: { width: "100%", height: 160 },
  cardImagePlaceholder: {
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImagePlaceholderText: { fontSize: 40 },
  cardBody: { padding: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1E293B", flex: 1 },
  scheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  scheduleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  cardDescription: { fontSize: 13, color: "#64748B", lineHeight: 18 },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#1E293B", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#94A3B8", textAlign: "center" },
});
