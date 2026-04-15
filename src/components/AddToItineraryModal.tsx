import React, { useState, useEffect } from "react";
import {
  Modal, View, Text, TouchableOpacity,
  ActivityIndicator, FlatList, TextInput, Alert, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";
import { travelService } from "../services/travel.service";
import { itineraryService } from "../services/itinerary.service";
import { ItineraryDTO } from "../dto/travel/travel.DTO";
import CalendarRangePicker from "./Common/CalendarRangePicker";

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
  const navigation = useNavigation<any>();
  const [itineraries, setItineraries] = useState<ItineraryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Selection state
  const [selectedItinId, setSelectedItinId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(""); // e.g., "09:00"
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  useEffect(() => {
    if (visible) {
      loadItineraries();
      // Reset state
      setSelectedItinId(null);
      setStartDate("");
      setEndDate("");
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

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempTime(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}`);
    }
  };

  const handleSave = async (override = false) => {
    if (!item || !selectedItinId || !startDate) {
      Alert.alert("Missing Info", "Please select an itinerary and date range.");
      return;
    }

    const itin = itineraries.find(i => i.id === selectedItinId);
    if (!itin) return;

    // Check for conflict (simplified for ranges)
    if (!override && startTime) {
      const dayData = (itin.days || []).find(d => d.date.startsWith(startDate));
      if (dayData) {
        const conflict = dayData.items.find(i => i.startTime === startTime);
        if (conflict) {
          Alert.alert(
            "Time Conflict",
            "This time slot is already taken on the start date. Proceed anyway?",
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
      await itineraryService.addItem({
        itineraryId: selectedItinId,
        startDate: startDate,
        endDate: endDate || startDate,
        date: startDate,
        type: item.type === "place" ? "PLACE" : "EVENT",
        locationId: item.type === "place" ? item.id : undefined,
        eventId: item.type === "event" ? item.id : undefined,
        referenceId: item.id, // Explicitly pass referenceId (Builder will sanitize if locationId is present)
        startTime: startTime || undefined,
        note: ""
      });
      onSuccess();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to add to itinerary");
    }
  };

  const selectedItin = itineraries.find(i => i.id === selectedItinId);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.header}>
              <Text style={styles.title}>Add to Itinerary</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 30 }} />
            ) : (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <Text style={styles.itemRef}>Adding: {item?.name}</Text>

                {/* Step 1: Pick Itinerary */}
                <View style={styles.labelRow}>
                  <Text style={styles.label}>1. Select Trip</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      onClose();
                      navigation.navigate("CreatePlan", { autoAddPlace: item });
                    }}
                  >
                    <Ionicons name="add-circle" size={22} color={COLORS.primary} />
                    <Text style={styles.addBtnText}>New</Text>
                  </TouchableOpacity>
                </View>
                {itineraries.length === 0 ? (
                  <Text style={styles.emptyText}>No itineraries found. Create one first!</Text>
                ) : (
                  <View style={styles.listWrapperVertical}>
                    <FlatList
                      data={itineraries}
                      scrollEnabled={false} // Disable FlatList scroll to let parent ScrollView handle it
                      keyExtractor={i => i.id.toString()}
                      renderItem={({ item: i }) => (
                        <TouchableOpacity
                          style={[styles.chipVertical, selectedItinId === i.id && styles.chipActive]}
                          onPress={() => {
                            setSelectedItinId(i.id);
                            setStartDate(""); // reset date on changing trip
                            setEndDate("");
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
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.label}>2. Select Date Range</Text>
                    <CalendarRangePicker
                      minDate={selectedItin.startDate}
                      onSelectRange={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                      }}
                    />
                  </View>
                )}

                {/* Step 3: Pick Time (Optional) */}
                {selectedItin && startDate && (
                  <View style={{ width: "100%", alignItems: "stretch" }}>
                    <Text style={styles.label}>3. Start Time (Optional)</Text>
                    <TouchableOpacity 
                      style={styles.timeInput}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={{ color: startTime ? COLORS.text : COLORS.muted }}>
                        {startTime || "Select time"}
                      </Text>
                      <Ionicons name="time-outline" size={20} color={COLORS.muted} />
                    </TouchableOpacity>

                    {showTimePicker && (
                      <DateTimePicker
                        value={tempTime}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                      />
                    )}
                  </View>
                )}

                {/* Footer */}
                <TouchableOpacity
                  style={[styles.saveBtn, (!selectedItinId || !startDate) && styles.saveBtnDisabled]}
                  disabled={!selectedItinId || !startDate}
                  onPress={() => handleSave(false)}
                >
                  <Text style={styles.saveBtnText}>Save Itinerary Item</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    maxHeight: "90%",
    width: "100%",
    alignItems: "stretch"
  },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16
  },
  title: { ...FONTS.h2, color: COLORS.text, fontWeight: "700" },
  closeBtn: { padding: 4 },
  itemRef: { ...FONTS.body1, color: COLORS.primary, marginBottom: 20, fontWeight: "600" },
  
  label: { ...FONTS.body2, color: COLORS.text, fontWeight: "600", marginBottom: 8, marginTop: 10 },
  labelRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 8, marginTop: 10
  },
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border
  },
  addBtnText: { ...FONTS.body2, color: COLORS.primary, fontWeight: "600" },
  listWrapper: { marginBottom: 14 },
  listWrapperVertical: { marginBottom: 14 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    marginRight: 10
  },
  chipVertical: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 8,
    width: "100%"
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...FONTS.body1, color: COLORS.text },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  
  timeInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...FONTS.body1,
    color: COLORS.text,
    marginBottom: 20,
    width: "100%"
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
