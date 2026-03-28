import React from "react";
import {
  View, Text, ScrollView,
  TouchableOpacity, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./EventDetail.Style";
import { EventDetailFunction } from "./EventDetail.Function";
import { COLORS } from "../../../constants/theme";
import { EventDTO } from "../../../dto/event/event.DTO";

const EventDetailScreen = ({ navigation, route }: any) => {
  // Nhận toàn bộ EventDTO qua params — BE không có GET /events/{id}
  const event: EventDTO = route.params?.event;
  const insets = useSafeAreaInsets();

  const { countdown, goBack } = EventDetailFunction(navigation, event);

  if (!event) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ color: COLORS.muted }}>Event not found</Text>
      </View>
    );
  }

  const statusStyle =
    event.status === "incoming"
      ? styles.statusIncoming
      : event.status === "ongoing"
      ? styles.statusOngoing
      : styles.statusCompleted;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero — no image from BE, use gradient placeholder */}
        <View style={[styles.heroImage, {
          backgroundColor: COLORS.card,
          alignItems: "center",
          justifyContent: "center",
        }]}>
          <Ionicons name="calendar" size={56} color={COLORS.primary} />
        </View>

        <View style={[styles.heroActions, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {event.status && (
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={styles.statusText}>{event.status}</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Countdown */}
          {event.status === "incoming" && countdown !== "" && (
            <View style={styles.countdownBox}>
              <Text style={styles.countdownLabel}>Starts in</Text>
              <Text style={styles.countdownValue}>{countdown}</Text>
            </View>
          )}

          {/* Date */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <View>
              <Text style={styles.infoText}>
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  weekday: "short", year: "numeric",
                  month: "long", day: "numeric",
                })}
              </Text>
              <Text style={styles.infoMeta}>
                {new Date(event.startDate).toLocaleTimeString([], {
                  hour: "2-digit", minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          {/* Address (from parent attraction if set) */}
          {event.address ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoText} numberOfLines={2}>{event.address}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => navigation.navigate("PlaceDetail", {
            placeId: event.attractionId,
            initialTab: "events",
          })}
        >
          <Ionicons name="location-outline" size={18} color="#fff" />
          <Text style={styles.chatBtnText}>View Attraction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventDetailScreen;
