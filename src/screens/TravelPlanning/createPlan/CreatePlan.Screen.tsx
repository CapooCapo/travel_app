import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCreatePlan } from "./useCreatePlan";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  content: { padding: SIZES.padding },
  label: { ...FONTS.body2, color: COLORS.muted, fontWeight: "600", textTransform: "uppercase", marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 12,
    ...FONTS.body1, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  calendarContainer: {
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 10,
  },
  rangeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  dateBlock: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  clearBtn: {
    marginLeft: 20,
    padding: 8,
  },
  row: { flexDirection: "row", gap: 10 },
  halfInput: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 12,
    ...FONTS.body1, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  hint: { ...FONTS.body2, color: COLORS.muted, marginBottom: 24, lineHeight: 18 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 14, alignItems: "center",
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },
  calendarWrapper: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  dateSummary: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  dateSummaryText: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: "600"
  },
});

import { Calendar } from "react-native-calendars";

const CreatePlanScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const {
    title, setTitle, description, setDescription,
    startDate, endDate,
    isLoading, canSubmit, handleCreate,
    onDayPress, markedDates, goBack,
  } = useCreatePlan(navigation, route);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Itinerary</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle}
          placeholder="Trip name" placeholderTextColor={COLORS.muted} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description}
          onChangeText={setDescription} placeholder="What's this trip about?"
          placeholderTextColor={COLORS.muted} multiline numberOfLines={3} />

        <View style={styles.calendarContainer}>
          <Text style={styles.label}>Select Date Range *</Text>
          <Calendar
            markedDates={markedDates}
            markingType={'period'}
            onDayPress={onDayPress}
            theme={{
              backgroundColor: COLORS.card,
              calendarBackground: COLORS.card,
              textSectionTitleColor: COLORS.muted,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.text,
              textDisabledColor: COLORS.border,
              monthTextColor: COLORS.text,
              arrowColor: COLORS.primary,
            }}
          />
        </View>

        {startDate ? (
          <View style={styles.dateSummary}>
            <Text style={styles.dateSummaryText}>
              <Ionicons name="calendar" size={16} /> {startDate} 
              {endDate ? `  →  ${endDate}` : " (Select end date)"}
            </Text>
          </View>
        ) : null}

        <Text style={styles.hint}>
          After creating your itinerary, you can add places and events day by day.
        </Text>

        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || isLoading) && styles.submitBtnDisabled]}
          onPress={handleCreate}
          disabled={!canSubmit || isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>Create Itinerary</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const getDatesBetween = (startDate: string, endDate: string) => {
  const dates: any = {};
  let start = new Date(startDate);
  const end = new Date(endDate);
  while (start <= end) {
    const dateString = start.toISOString().split('T')[0];
    if (dateString !== startDate && dateString !== endDate) {
      dates[dateString] = { color: '#E3F2FD', textColor: '#007AFF' };
    }
    start.setDate(start.getDate() + 1);
  }
  return dates;
};

export default CreatePlanScreen;
