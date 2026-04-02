import React, { useState, useEffect } from "react";
import {
  Modal, View, Text, TouchableOpacity,
  ActivityIndicator, FlatList, TextInput, Alert, StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";
import { travelService } from "../services/travel.service";
import { ItineraryDTO } from "../dto/travel/travel.DTO";

export type ItemToAdd = {
  id: number;
  name: string;
  type: "place" | "event";
};

interface AddToItineraryModalProps {
  visible: boolean;
  item: ItemToAdd | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddToItineraryModal({
  visible, item, onClose, onSuccess
}: AddToItineraryModalProps) {
  const [itineraries, setItineraries] = useState<ItineraryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Selection state
  const [selectedItinId, setSelectedItinId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(""); // e.g., "09:00"

  useEffect(() => {
    if (visible) {
      loadItineraries();
      // Reset state
      setSelectedItinId(null);
      setSelectedDate("");
      setStartTime("");
    }
  }, [visible]);

  const loadItineraries = async () => {
    setIsLoading(true);
    try {
      const res = await travelService.getItineraries();
      setItineraries(res ?? []);
    } catch {
      Alert.alert("Error", "Could not load itineraries");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDates = (itin: ItineraryDTO) => {
    // Generate an array of dates from startDate to endDate
    const dates: string[] = [];
    let curr = new Date(itin.startDate);
    const end = new Date(itin.endDate);
    while (curr <= end) {
      dates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const handleSave = async (override = false) => {
    if (!item || !selectedItinId || !selectedDate) {
      Alert.alert("Missing Info", "Please select an itinerary and date.");
      return;
    }

    const itin = itineraries.find(i => i.id === selectedItinId);
    if (!itin) return;

    // Check for conflict
    if (!override && startTime) {
      const dayData = itin.days.find(d => d.date.startsWith(selectedDate));
      if (dayData) {
        const conflict = dayData.items.find(i => i.startTime === startTime);
        if (conflict) {
          Alert.alert(
            "Time Conflict",
            "This time slot is already taken. Proceed anyway?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Proceed", onPress: () => handleSave(true) }
            ]
          );
          return;
        }
      }
    }

    try {
      await travelService.addItineraryItem(selectedItinId, {
        itineraryId: selectedItinId,
        date: selectedDate,
        type: item.type,
        referenceId: item.id,
        startTime: startTime || undefined,
        note: ""
      });
      // Mock update locally to prevent immediate re-fetching issues, or assume BE handles it
      onSuccess();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to add to itinerary");
    }
  };

  const selectedItin = itineraries.find(i => i.id === selectedItinId);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Add to Itinerary</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 30 }} />
          ) : (
            <>
              <Text style={styles.itemRef}>Adding: {item?.name}</Text>

              {/* Step 1: Pick Itinerary */}
              <Text style={styles.label}>1. Select Trip</Text>
              {itineraries.length === 0 ? (
                <Text style={styles.emptyText}>No itineraries found. Create one first!</Text>
              ) : (
                <View style={styles.listWrapper}>
                  <FlatList
                    data={itineraries}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={i => i.id.toString()}
                    renderItem={({ item: i }) => (
                      <TouchableOpacity
                        style={[styles.chip, selectedItinId === i.id && styles.chipActive]}
                        onPress={() => {
                          setSelectedItinId(i.id);
                          setSelectedDate(""); // reset date on changing trip
                        }}
                      >
                        <Text style={[styles.chipText, selectedItinId === i.id && styles.chipTextActive]}>
                          {i.title}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {/* Step 2: Pick Date */}
              {selectedItin && (
                <>
                  <Text style={styles.label}>2. Select Date</Text>
                  <View style={styles.listWrapper}>
                    <FlatList
                      data={getAvailableDates(selectedItin)}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={d => d}
                      renderItem={({ item: d }) => (
                        <TouchableOpacity
                          style={[styles.chip, selectedDate === d && styles.chipActive]}
                          onPress={() => setSelectedDate(d)}
                        >
                          <Text style={[styles.chipText, selectedDate === d && styles.chipTextActive]}>
                            {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </>
              )}

              {/* Step 3: Pick Time (Optional) */}
              {selectedItin && selectedDate && (
                <>
                  <Text style={styles.label}>3. Start Time (Optional)</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="HH:MM (e.g. 09:30)"
                    placeholderTextColor={COLORS.muted}
                    value={startTime}
                    onChangeText={setStartTime}
                    maxLength={5}
                    keyboardType="numeric"
                  />
                </>
              )}

              {/* Footer */}
              <TouchableOpacity
                style={[styles.saveBtn, (!selectedItinId || !selectedDate) && styles.saveBtnDisabled]}
                disabled={!selectedItinId || !selectedDate}
                onPress={() => handleSave(false)}
              >
                <Text style={styles.saveBtnText}>Save Itinerary Item</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radius + 10,
    borderTopRightRadius: SIZES.radius + 10,
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16
  },
  title: { ...FONTS.h2, color: COLORS.text, fontWeight: "700" },
  closeBtn: { padding: 4 },
  itemRef: { ...FONTS.body1, color: COLORS.primary, marginBottom: 20, fontWeight: "600" },
  
  label: { ...FONTS.body2, color: COLORS.text, fontWeight: "600", marginBottom: 8, marginTop: 10 },
  listWrapper: { marginBottom: 14 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    marginRight: 10
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...FONTS.body1, color: COLORS.text },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  
  timeInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    ...FONTS.body1,
    color: COLORS.text,
    marginBottom: 20,
    width: "40%"
  },
  
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },
  emptyText: { ...FONTS.body2, color: COLORS.muted, marginBottom: 14 }
});
