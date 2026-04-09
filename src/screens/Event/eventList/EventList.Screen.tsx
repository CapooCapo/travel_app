import React from "react";
import {
  View, Text, FlatList, TouchableOpacity, Image,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./EventList.Style";
import { useEventList, LocationWithEvents } from "./useEventList";
import { COLORS } from "../../../constants/theme";
import { EventResponse } from "../../../dto/event/event.DTO";

// ─── Photo pool (same as Home/Explore) ───────────────────────────────────────
const PHOTO_POOLS: Record<string, string[]> = {
  food:       ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400"],
  nature:     ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400"],
  beach:      ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400", "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400"],
  culture:    ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400"],
  museum:     ["https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=400", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400"],
  default:    ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400"],
};

function getPlaceImage(name: string, category?: string): string {
  const key = category?.toLowerCase() ?? "";
  const pool =
    PHOTO_POOLS[key] ??
    Object.entries(PHOTO_POOLS).find(([k]) => key.includes(k))?.[1] ??
    PHOTO_POOLS.default;
  const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
  return pool[index];
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: EventResponse["status"] }) {
  if (!status) return null;
  const colors: Record<string, string> = {
    incoming:  COLORS.primary,
    ongoing:   "#00c864",
    completed: COLORS.muted,
  };
  return (
    <View style={[styles.statusBadge, { backgroundColor: colors[status] ?? COLORS.muted }]}>
      <Text style={styles.statusText}>{status.toUpperCase()}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
const EventListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    locations, isLoading, hasMore,
    handleLoadMore, navigateToPlaceEvents,
    navigateToEventDetail, refresh,
  } = useEventList(navigation);

  const renderCard = ({ item }: { item: LocationWithEvents }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToPlaceEvents(item.id)}
      activeOpacity={0.85}
    >
      {/* Place image */}
      <Image
        source={{ uri: getPlaceImage(item.name, item.category) }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />

      {/* Event count badge */}
      {item.eventsLoaded && item.events && (
        <View style={styles.eventCountBadge}>
          <Ionicons name="calendar" size={11} color="#fff" />
          <Text style={styles.eventCountText}>
            {item.events.length > 0 ? `${item.events.length} event${item.events.length > 1 ? "s" : ""}` : "No events"}
          </Text>
        </View>
      )}

      <View style={styles.cardBody}>
        {/* Place info */}
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={12} color={COLORS.muted} />
          <Text style={styles.cardMetaText} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Ionicons name="star" size={12} color={COLORS.primary} />
          <Text style={styles.cardMetaText}>
            {item.rating > 0 ? item.rating.toFixed(1) : "New"}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Events preview */}
        {!item.eventsLoaded ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading events…</Text>
          </View>
        ) : item.events.length === 0 ? (
          <Text style={styles.noEventsText}>No upcoming events</Text>
        ) : (
          <View style={styles.eventsList}>
            {item.events.slice(0, 2).map((ev) => (
              <TouchableOpacity
                key={ev.id}
                onPress={(e) => { e.stopPropagation(); navigateToEventDetail(ev); }}
                style={styles.eventPill}
              >
                <Ionicons name="calendar-outline" size={12} color={COLORS.primary} />
                <Text style={styles.eventPillTitle} numberOfLines={1}>{ev.title}</Text>
                <StatusBadge status={ev.status} />
              </TouchableOpacity>
            ))}
            {item.events.length > 2 && (
              <Text style={styles.moreEvents}>+{item.events.length - 2} more →</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
      </View>

      <FlatList
        data={locations}
        renderItem={renderCard}
        keyExtractor={(item) => `attr-${item.id}`}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && (!locations || locations.length === 0)}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No places found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : null
        }
      />

      {/* Floating Action Button for Creating Events */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => {
          console.log("Create Event button pressed");
          navigation.navigate("CreateEvent");
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      {(() => { console.log("Create Event button rendered"); return null; })()}
    </View>
  );
};

export default EventListScreen;
