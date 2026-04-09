import React from "react";
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StatusBar, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./EventDetail.Style";
import { useEventDetail } from "./useEventDetail";
import { COLORS } from "../../../constants/theme";
import { EventResponse } from "../../../dto/event/event.DTO";
import AddToItineraryModal from "../../../components/AddToItineraryModal";

const EVENT_HERO_POOL = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
];

function getEventHero(title: string): string {
  const index = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % EVENT_HERO_POOL.length;
  return EVENT_HERO_POOL[index];
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  INCOMING:  { color: COLORS.primary, label: "Upcoming" },
  ONGOING:   { color: "#00c864",      label: "Happening Now" },
  COMPLETED: { color: COLORS.muted,   label: "Ended" },
};

const EventDetailScreen = ({ navigation, route }: any) => {
  const initialEvent: EventResponse = route.params?.event;
  const eventId = route.params?.eventId || initialEvent?.id;
  
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = React.useState(false);
  const { 
    event, 
    countdown, 
    isBookmarked, 
    isLoading, 
    isFetchingDetail, 
    toggleBookmark, 
    handleShare, 
    openInMaps,
    goBack 
  } = useEventDetail(navigation, eventId, initialEvent);

  if (!event && isFetchingDetail) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: 12 }}>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.muted} />
        <Text style={{ color: COLORS.muted, marginTop: 8 }}>Event not found</Text>
        <TouchableOpacity onPress={goBack} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusCfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.INCOMING;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: event.images && event.images.length > 0 ? event.images[0] : getEventHero(event.title) }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,21,36,0.85)"]}
            style={styles.heroGradient}
          />

          {/* Header Action Row */}
          <View style={[styles.heroActions, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                  <Ionicons name="share-social-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={toggleBookmark} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={20} color={isBookmarked ? COLORS.primary : "#fff"} />
                  )}
                </TouchableOpacity>
            </View>
          </View>

          {/* Status badge on hero */}
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.color }]}>
            <Text style={styles.statusText}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>{event.category}</Text>
          </View>

          {/* Countdown box — only for upcoming events */}
          {event.status === "INCOMING" && countdown !== "" && (
            <View style={styles.countdownBox}>
              <Text style={styles.countdownLabel}>Starts in</Text>
              <Text style={styles.countdownValue}>{countdown}</Text>
            </View>
          )}

          {/* Info rows */}
          <View style={styles.infoCard}>
            {/* Start Date */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Starts</Text>
                <Text style={styles.infoText}>
                  {new Date(event.startTime).toLocaleDateString("en-US", {
                    weekday: "short", year: "numeric", month: "long", day: "numeric",
                  })}
                </Text>
                <Text style={styles.infoMeta}>
                  {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            {/* End Date */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Ends</Text>
                <Text style={styles.infoText}>
                  {new Date(event.endTime).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                  })} at {new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>

            {/* Address */}
            {event.address && (
              <>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoText} numberOfLines={2}>{event.address}</Text>
                  </View>
                  <TouchableOpacity style={styles.navigateBtn} onPress={openInMaps}>
                    <Ionicons name="navigate-circle-outline" size={30} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Price */}
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="ticket-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Admission</Text>
                <Text style={styles.infoText}>
                  {event.price === null || event.price <= 0 ? "Free Entry" : `$${event.price}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>About Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={[styles.primaryBtn, { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
          <Text style={[styles.primaryBtnText, { color: COLORS.primary }]}>Add to Trip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.primaryBtn, { flex: 1 }]}
          onPress={() => navigation.navigate("PlaceDetail", {
            placeId: event.locationId,
            initialTab: "events",
          })}
        >
          <Ionicons name="location-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>View Place</Text>
        </TouchableOpacity>
      </View>

      <AddToItineraryModal
        visible={modalVisible}
        item={{ id: event.id, name: event.title, type: "event" }}
        onClose={() => setModalVisible(false)}
        onSuccess={() => setModalVisible(false)}
      />
    </View>
  );
};

export default EventDetailScreen;
