import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../Feed.Style";
import { COLORS } from "../../../../constants/theme";
import { FeedItemDTO } from "../../../../dto/social/social.DTO";

const TYPE_META: Record<string, { icon: string; color: string }> = {
  rating:     { icon: "star",            color: "#f5a623" },
  event_join: { icon: "calendar",        color: COLORS.primary },
  bookmark:   { icon: "bookmark",        color: "#00c864" },
  review:     { icon: "chatbubble",      color: "#7c6af7" },
};

interface FeedItemProps {
  item: FeedItemDTO;
  onPress: (item: FeedItemDTO) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ item, onPress }) => {
  const meta = TYPE_META[item.type] ?? { icon: "ellipse", color: COLORS.muted };
  const initial = item.userName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.message}>
          <Text style={styles.nameHighlight}>{item.userName} </Text>
          {item.message}{" "}
          <Text style={styles.targetHighlight}>{item.targetName}</Text>
        </Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      <View style={[styles.typeIcon, { backgroundColor: meta.color + "22" }]}>
        <Ionicons name={meta.icon as any} size={14} color={meta.color} />
      </View>
    </TouchableOpacity>
  );
};
