import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Feed.Style";
import { FeedFunction } from "./Feed.Function";
import { COLORS } from "../../../constants/theme";
import { FeedItemDTO } from "../../../dto/social/social.DTO";

const TYPE_META: Record<string, { icon: string; color: string }> = {
  rating:     { icon: "star",            color: "#f5a623" },
  event_join: { icon: "calendar",        color: COLORS.primary },
  bookmark:   { icon: "bookmark",        color: "#00c864" },
  review:     { icon: "chatbubble",      color: "#7c6af7" },
};

const FeedScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { feedItems, isLoading, handleLoadMore, navigateToTarget, refresh } =
    FeedFunction(navigation);

  const renderItem = ({ item }: { item: FeedItemDTO }) => {
    const meta = TYPE_META[item.type] ?? { icon: "ellipse", color: COLORS.muted };
    const initial = item.userName?.charAt(0)?.toUpperCase() ?? "?";

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigateToTarget(item)}
        activeOpacity={0.8}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        {/* Message */}
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

        {/* Type icon */}
        <View style={[styles.typeIcon, { backgroundColor: meta.color + "22" }]}>
          <Ionicons name={meta.icon as any} size={14} color={meta.color} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends' Activity</Text>
      </View>

      <FlatList
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item) => `feed-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
        ListFooterComponent={
          isLoading
            ? <View style={styles.footerLoader}><ActivityIndicator color={COLORS.primary} /></View>
            : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={52} color={COLORS.muted} />
              <Text style={styles.emptyText}>Nothing here yet</Text>
              <Text style={styles.emptySubText}>
                Follow other travelers to see their activity
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default FeedScreen;
