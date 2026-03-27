import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./CreateEvent.Style";
import { CreateEventFunction } from "./CreateEvent.Function";
import { COLORS } from "../../../constants/theme";

const CreateEventScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    title, setTitle, category, setCategory,
    description, setDescription, address, setAddress,
    startDate, setStartDate, endDate, setEndDate,
    price, setPrice, isFree, setIsFree,
    isLoading, canSubmit, handleCreate, goBack,
  } = CreateEventFunction(navigation);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle}
          placeholder="Event title" placeholderTextColor={COLORS.muted} />

        <Text style={styles.label}>Category</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory}
          placeholder="e.g. Food, Music, Sports" placeholderTextColor={COLORS.muted} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description}
          onChangeText={setDescription} placeholder="Describe your event…"
          placeholderTextColor={COLORS.muted} multiline numberOfLines={4} />

        <Text style={styles.label}>Location *</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress}
          placeholder="Full address" placeholderTextColor={COLORS.muted} />

        <Text style={styles.label}>Date & Time *</Text>
        <View style={styles.row}>
          <TextInput style={styles.halfInput} value={startDate} onChangeText={setStartDate}
            placeholder="Start (YYYY-MM-DD)" placeholderTextColor={COLORS.muted} />
          <TextInput style={styles.halfInput} value={endDate} onChangeText={setEndDate}
            placeholder="End (YYYY-MM-DD)" placeholderTextColor={COLORS.muted} />
        </View>

        <View style={styles.freeRow}>
          <Text style={styles.freeLabel}>Free Admission</Text>
          <TouchableOpacity
            style={[styles.toggleTrack, { backgroundColor: isFree ? COLORS.primary : COLORS.border }]}
            onPress={() => setIsFree(!isFree)}
          >
            <View style={[styles.toggleThumb, { alignSelf: isFree ? "flex-end" : "flex-start" }]} />
          </TouchableOpacity>
        </View>

        {!isFree && (
          <>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice}
              placeholder="0.00" placeholderTextColor={COLORS.muted} keyboardType="decimal-pad" />
          </>
        )}

        <Text style={styles.hint}>
          Your event will be reviewed by an admin before being listed.
        </Text>

        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || isLoading) && styles.submitBtnDisabled]}
          onPress={handleCreate}
          disabled={!canSubmit || isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>Submit Event</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
