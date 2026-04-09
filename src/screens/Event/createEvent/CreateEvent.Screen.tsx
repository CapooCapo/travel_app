import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StatusBar, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./CreateEvent.Style";
import { useCreateEvent } from "./useCreateEvent";
import { COLORS } from "../../../constants/theme";

const CreateEventScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const {
    title, setTitle, categoryId, setCategoryId, categories,
    description, setDescription, 
    locationKeyword, setLocationKeyword, suggestions, isSearching, handleSelectLocation, setSelectedLocation,
    startTime, endTime, 
    openStartPicker, openEndPicker,
    price, setPrice, isFree, setIsFree,
    isLoading, canSubmit, handleSubmit, isEditMode,
    goBack,
  } = useCreateEvent(navigation, route);

  const formatDisplayDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? "Edit Event" : "Create New Event"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle}
            placeholder="Cool music festival" 
            placeholderTextColor={COLORS.muted} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, categoryId === cat.id && styles.activeCategoryChip]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text style={[styles.categoryChipText, categoryId === cat.id && styles.activeCategoryChipText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={description}
            onChangeText={setDescription} 
            placeholder="Tell people what this event is about..."
            placeholderTextColor={COLORS.muted} 
            multiline 
            numberOfLines={4} 
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.section, { zIndex: 1000 }]}>
          <Text style={styles.label}>Location *</Text>
          <View>
            <TextInput
              style={styles.input}
              value={locationKeyword}
              onChangeText={(txt) => {
                setLocationKeyword(txt);
                setSelectedLocation(null);
              }}
              placeholder="Search location..."
              placeholderTextColor={COLORS.muted}
            />
            {isSearching && (
              <View style={{ position: 'absolute', right: 12, top: 14 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            )}
            {suggestions.length > 0 && (
              <View style={styles.suggestionList}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                    <Text style={[styles.suggestionText, { fontSize: 12, color: COLORS.muted }]}>
                      {item.address}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date & Time *</Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeBox}>
              <Text style={[styles.label, { fontSize: 10, marginBottom: 4 }]}>START</Text>
              <TouchableOpacity style={styles.dateDisplay} onPress={openStartPicker}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                <Text style={styles.dateDisplayText}>{formatDisplayDate(startTime)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeBox}>
              <Text style={[styles.label, { fontSize: 10, marginBottom: 4 }]}>END</Text>
              <TouchableOpacity 
                style={[styles.dateDisplay, startTime >= endTime && { borderColor: '#ff4444' }]} 
                onPress={openEndPicker}
              >
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                <Text style={styles.dateDisplayText}>{formatDisplayDate(endTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {startTime >= endTime && (
            <Text style={styles.errorText}>End time must be after start time</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.freeRow}>
            <Text style={styles.label}>Admission</Text>
            <TouchableOpacity
              style={[styles.toggleTrack, { backgroundColor: isFree ? COLORS.primary : COLORS.border }]}
              onPress={() => setIsFree(!isFree)}
            >
              <View style={[styles.toggleThumb, { marginLeft: isFree ? 22 : 2 }]} />
            </TouchableOpacity>
            <Text style={[styles.freeLabel, { color: isFree ? COLORS.primary : COLORS.muted }]}>
              {isFree ? "Free Entry" : "Paid Event"}
            </Text>
          </View>

          {!isFree && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Price (USD)</Text>
              <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice}
                placeholder="25.00" 
                placeholderTextColor={COLORS.muted} 
                keyboardType="decimal-pad" 
              />
            </View>
          )}
        </View>

        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.noticeText}>
            {isEditMode ? "Editing this event will reset its status to pending moderation." : "Your event will be visible to everyone once an administrator approves it."}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || isLoading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>{isEditMode ? "Save Changes" : "Create Event"}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
