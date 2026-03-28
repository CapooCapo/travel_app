import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./EventList.Style";
import { EventListFunction, AttractionWithEvents } from "./EventList.Function";
import { COLORS } from "../../../constants/theme";

const EventListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    attractions, isLoading, hasMore,
    handleLoadMore, navigateToPlaceEvents,
    navigateToEventDetail, refresh,
  } = EventListFunction(navigation);

  const renderCard = ({ item }: { item: AttractionWithEvents }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToPlaceEvents(item.id)}
      activeOpacity={0.85}
    >
      {/* Image placeholder */}
      <View style={[styles.cardImage, {
        backgroundColor: COLORS.card,
        alignItems: "center", justifyContent: "center",
      }]}>
        <Ionicons name="location" size={36} color={COLORS.primary} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={13} color={COLORS.muted} />
          <Text style={styles.cardMetaText} numberOfLines={1}>{item.address}</Text>
        </View>

        <View style={styles.cardMeta}>
          <Ionicons name="star" size={13} color={COLORS.primary} />
          <Text style={styles.cardMetaText}>
            {item.rating > 0 ? item.rating.toFixed(1) : "New"}
          </Text>
        </View>

        {/* Events preview */}
        {item.eventsLoaded && item.events.length > 0 ? (
          <View style={{ marginTop: 8, gap: 4 }}>
            {item.events.slice(0, 2).map((ev) => (
              <TouchableOpacity
                key={ev.id}
                onPress={(e) => { e.stopPropagation(); navigateToEventDetail(ev); }}
                style={{
                  flexDirection: "row", alignItems: "center", gap: 6,
                  backgroundColor: COLORS.surface,
                  borderRadius: 8, padding: 8,
                  borderWidth: 1, borderColor: COLORS.border,
                }}
              >
                <Ionicons name="calendar-outline" size={13} color={COLORS.primary} />
                <Text style={{ color: COLORS.text, fontSize: 12, flex: 1 }} numberOfLines={1}>
                  {ev.title}
                </Text>
                <Text style={{
                  fontSize: 10, fontWeight: "700",
                  color: ev.status === "incoming" ? COLORS.primary :
                    ev.status === "ongoing" ? "#00c864" : COLORS.muted,
                }}>
                  {ev.status?.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
            {item.events.length > 2 && (
              <Text style={{ color: COLORS.primary, fontSize: 11, marginTop: 2 }}>
                +{item.events.length - 2} more events →
              </Text>
            )}
          </View>
        ) : item.eventsLoaded ? (
          <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 6 }}>
            No upcoming events
          </Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={{ color: COLORS.muted, fontSize: 12 }}>Loading events…</Text>
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
        data={attractions}
        renderItem={renderCard}
        keyExtractor={(item) => `attr-${item.id}`}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && attractions.length === 0}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No attractions found</Text>
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
    </View>
  );
};

export default EventListScreen;
