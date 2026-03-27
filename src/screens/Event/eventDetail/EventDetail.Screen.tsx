import React from "react";
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./EventDetail.Style";
import { EventDetailFunction } from "./EventDetail.Function";
import { COLORS } from "../../../constants/theme";

const EventDetailScreen = ({ navigation, route }: any) => {
  const { eventId } = route.params;
  const insets = useSafeAreaInsets();
  const { event, isLoading, isBookmarked, countdown, handleToggleBookmark, goBack } =
    EventDetailFunction(navigation, eventId);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (!event) return null;

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
        {/* Hero */}
        <View>
          <Image
            source={{ uri: event.imageUrl ?? "https://via.placeholder.com/400x240" }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={[styles.heroActions, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.heroActionsRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleToggleBookmark}>
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? COLORS.primary : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={styles.statusText}>{event.status}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Countdown */}
          {event.status === "incoming" && countdown !== "" && (
            <View style={styles.countdownBox}>
              <Text style={styles.countdownLabel}>Starts in</Text>
              <Text style={styles.countdownValue}>{countdown}</Text>
            </View>
          )}

          {/* Info rows */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <View>
              <Text style={styles.infoText}>
                {new Date(event.startDate).toLocaleDateString()} –{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </Text>
              <Text style={styles.infoMeta}>
                {new Date(event.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText} numberOfLines={2}>{event.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {event.isFree ? "Free Admission" : `$${event.price}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Organizer</Text>
          <View style={styles.organizerCard}>
            <View style={styles.organizerAvatar}>
              <Ionicons name="person" size={20} color={COLORS.muted} />
            </View>
            <View>
              <Text style={styles.organizerName}>{event.organizerName}</Text>
              <Text style={styles.organizerRole}>Event Organizer</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.bookmarkBtn} onPress={handleToggleBookmark}>
          <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatBtn}>
          <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
          <Text style={styles.chatBtnText}>Join Discussion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventDetailScreen;
