import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, StatusBar, StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { reviewService } from "../../../services/review.service";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.bg },
  header:          { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  headerTitle:     { ...FONTS.h2, color: COLORS.text },
  content:         { padding: SIZES.padding },
  label:           { ...FONTS.body2, color: COLORS.muted, fontWeight: "600", textTransform: "uppercase", marginBottom: 10 },
  starsRow:        { flexDirection: "row", gap: 10, marginBottom: 24 },
  commentInput: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 12,
    ...FONTS.body1, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
    height: 130, textAlignVertical: "top", marginBottom: 24,
  },
  submitBtn:         { backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 14, alignItems: "center" },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText:     { ...FONTS.body1, color: "#fff", fontWeight: "700" },
  ratingHint:        { ...FONTS.body2, color: COLORS.muted, marginBottom: 20 },
});

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const WriteReviewScreen = ({ navigation, route }: any) => {
  // attractionId từ PlaceDetail.Function: navigateToWriteReview()
  const { attractionId } = route.params;
  const insets = useSafeAreaInsets();

  const [rating,    setRating]    = useState(0);
  const [content,   setContent]   = useState("");   // BE dùng "content"
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = rating > 0 && content.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    try {
      // reviewService.createReview(attractionId, rating, content, imageUrl?)
      await reviewService.createReview(attractionId, rating, content.trim());
      Alert.alert("Review Submitted ✅", "Thank you for your feedback!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={38}
                color={star <= rating ? COLORS.primary : COLORS.muted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingHint}>{RATING_LABELS[rating]}</Text>
        )}

        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={styles.commentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Share your experience (min. 10 characters)…"
          placeholderTextColor={COLORS.muted}
          multiline
          numberOfLines={5}
        />

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>Submit Review</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WriteReviewScreen;
