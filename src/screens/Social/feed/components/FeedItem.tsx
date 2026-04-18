import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../Feed.Style";
import { COLORS } from "../../../../constants/theme";
import { FeedItemDTO } from "../../../../dto/social/social.DTO";

const TYPE_META: Record<string, { icon: string; color: string }> = {
  REVIEW_CREATED:       { icon: "chatbubble",      color: "#7c6af7" },
  EVENT_JOINED:         { icon: "calendar",        color: COLORS.primary },
  ITINERARY_CREATED:    { icon: "map",             color: "#00c864" },
  LOCATION_ADDED:       { icon: "bookmark",        color: "#00c864" },
  LOCATION_SHARED:      { icon: "share-social",     color: "#f5a623" },
  USER_FOLLOWED:        { icon: "person-add",      color: "#3498db" },
  LOCATION_RECOMMENDED: { icon: "star",            color: "#f5a623" },
  SYSTEM:               { icon: "notifications",   color: COLORS.muted },
};

interface FeedItemProps {
  item: FeedItemDTO;
  onPress: (item: FeedItemDTO) => void;
  onFollow?: (userId: number) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ item, onPress, onFollow }) => {
  const meta = TYPE_META[item.type] ?? { icon: "ellipse", color: COLORS.muted };
  const initial = item.userName?.charAt(0)?.toUpperCase() ?? "?";
  const showFollow = item.isFollowing === false && onFollow;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <TouchableOpacity 
        style={styles.avatar} 
        onPress={() => onPress({ ...item, targetType: 'USER', targetId: item.actorId })}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.message} numberOfLines={2}>
          <Text style={styles.nameHighlight}>{item.userName} </Text>
          {item.message}{" "}
          <Text style={styles.targetHighlight}>{item.targetName || item.content}</Text>
        </Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {showFollow ? (
        <TouchableOpacity 
          style={styles.itemFollowButton}
          onPress={() => onFollow(item.actorId)}
        >
          <Text style={styles.itemFollowText}>Follow</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.typeIcon, { backgroundColor: meta.color + "22" }]}>
          <Ionicons name={meta.icon as any} size={14} color={meta.color} />
        </View>
      )}
    </TouchableOpacity>
  );
};
