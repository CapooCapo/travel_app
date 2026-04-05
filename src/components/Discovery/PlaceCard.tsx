import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "../../constants/theme";
import { getPlaceImage } from "../../utils/imageUtils";

interface PlaceCardProps {
  id: string;
  name: string;
  address?: string;
  category?: string;
  rating?: number;
  aiReason?: string;
  onPress: () => void;
  variant?: "horizontal" | "vertical";
  style?: ViewStyle;
}

/**
 * A reusable card component for displaying places/attractions.
 * Supports both horizontal (featured) and vertical (list) layouts.
 */
export const PlaceCard: React.FC<PlaceCardProps> = ({
  id,
  name,
  address,
  category,
  rating = 0,
  aiReason,
  onPress,
  variant = "vertical",
  style,
}) => {
  const imageUrl = getPlaceImage(name, category);
  const isHorizontal = variant === "horizontal";

  return (
    <TouchableOpacity
      style={[
        isHorizontal ? styles.cardHorizontal : styles.cardVertical,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={isHorizontal ? styles.imageHorizontal : styles.imageVertical}
        resizeMode="cover"
      />

      {/* AI Recommendation Badge (if available) */}
      {aiReason && (
        <LinearGradient
          colors={[COLORS.primary + '33', COLORS.primary + '10']}
          style={styles.aiBadge}
        >
          <Text style={styles.aiText}>
            ✨ AI Recommends: {aiReason}
          </Text>
        </LinearGradient>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        
        {address && !isHorizontal && (
            <View style={styles.row}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="location-outline" size={12} color={COLORS.muted} />
                </View>
                <Text style={styles.address} numberOfLines={1}>{address}</Text>
            </View>
        )}

        {category && isHorizontal && (
          <Text style={styles.category}>{category}</Text>
        )}

        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="star" size={12} color={COLORS.primary} />
            </View>
            <Text style={styles.ratingText}>
              {rating > 0 ? rating.toFixed(1) : "New"}
            </Text>
          </View>
          
          {!isHorizontal && category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Horizontal (Featured) Layout
  cardHorizontal: {
    width: 250,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  imageHorizontal: {
    width: "100%",
    height: 140,
  },

  // Vertical (List) Layout
  cardVertical: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  imageVertical: {
    width: "100%",
    height: 180,
  },

  // Common Elements
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: COLORS.muted,
    marginLeft: 4,
  },
  category: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  categoryBadge: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
  },
  aiBadge: {
    padding: 8,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  aiText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
