import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StatusBar
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ItineraryDetail.Style";
import { ItineraryDetailFunction } from "./ItineraryDetail.Function";
import { COLORS } from "../../../constants/theme";
import { DayPlanDTO, DayPlanItemDTO } from "../../../dto/travel/travel.DTO";

const ItineraryDetailScreen = ({ navigation, route }: any) => {
  const { itineraryId } = route.params;
  const insets = useSafeAreaInsets();
  const {
    itinerary, isLoading,
    removeItem, moveItem, goBack, handleAddNewStop
  } = ItineraryDetailFunction(navigation, itineraryId);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ color: COLORS.muted }}>Itinerary not found</Text>
        <TouchableOpacity onPress={goBack} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = (item: DayPlanItemDTO, dayIndex: number, itemIndex: number, totalItems: number) => {
    return (
      <View key={`item-${item.id}`} style={styles.timelineRow}>
        <View style={styles.timelineLine}>
          <View style={styles.dot} />
          {itemIndex < totalItems - 1 && <View style={styles.line} />}
        </View>

        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeItem(item.id)}
          >
            <Ionicons name="close" size={14} color="#fff" />
          </TouchableOpacity>

          <View style={styles.cardIconBox}>
            <Ionicons
              name={item.type === "place" ? "map-outline" : "calendar-outline"}
              size={20}
              color={COLORS.primary}
            />
          </View>
          
          <View style={styles.cardContent}>
            {item.startTime ? (
              <Text style={styles.cardTime}>{item.startTime}</Text>
            ) : null}
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDesc}>{item.address}</Text>
          </View>

          {/* Reordering Up/Down */}
          <View style={styles.reorderBox}>
            <TouchableOpacity
              disabled={itemIndex === 0}
              onPress={() => moveItem(dayIndex, itemIndex, "up")}
            >
              <Ionicons
                name="chevron-up"
                size={22}
                color={itemIndex === 0 ? COLORS.muted : COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={itemIndex === totalItems - 1}
              onPress={() => moveItem(dayIndex, itemIndex, "down")}
            >
              <Ionicons
                name="chevron-down"
                size={22}
                color={itemIndex === totalItems - 1 ? COLORS.muted : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDay = (day: DayPlanDTO, dayIndex: number) => {
    return (
      <View key={`day-${day.date}`} style={styles.dayBlock}>
        <View style={styles.dayHeader}>
          <View style={styles.dayIndicator}>
            <Text style={styles.dayIndicatorText}>{dayIndex + 1}</Text>
          </View>
          <Text style={styles.dayHeaderText}>
            {new Date(day.date).toLocaleDateString("en-US", {
              weekday: "long", month: "short", day: "numeric"
            })}
          </Text>
        </View>

        {day.items.length === 0 ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.emptyDayText}>No plans yet for this day</Text>
          </View>
        ) : (
          <View>
            {day.items.map((it, idx) => renderItem(it, dayIndex, idx, day.items.length))}
          </View>
        )}

        <TouchableOpacity style={styles.addStopBtn} onPress={handleAddNewStop}>
          <Ionicons name="add" size={16} color={COLORS.primary} />
          <Text style={styles.addStopText}>Add Stop</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.headerHero, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>{itinerary.title}</Text>
        <View style={styles.pageDates}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
          <Text style={styles.pageDatesText}>
            {new Date(itinerary.startDate).toLocaleDateString()} — {new Date(itinerary.endDate).toLocaleDateString()}
          </Text>
        </View>
        {itinerary.description && (
          <Text style={styles.pageDesc}>{itinerary.description}</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {itinerary.days.map((day, ix) => renderDay(day, ix))}
      </ScrollView>
    </View>
  );
};

export default ItineraryDetailScreen;
