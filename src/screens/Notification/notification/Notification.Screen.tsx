import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Notification.Style";
import { useNotification } from "./useNotification";
import { COLORS } from "../../../constants/theme";
import { NotificationDTO } from "../../../dto/notification/notification.DTO";

const TYPE_ICON: Record<string, { name: string; color: string }> = {
  offer: { name: "pricetag-outline", color: "#00c864" },
  alert: { name: "warning-outline", color: COLORS.danger },
  message: { name: "chatbubble-outline", color: COLORS.primary },
  event: { name: "calendar-outline", color: "#f5a623" },
  review: { name: "star-outline", color: COLORS.primary },
};

const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    notifications, unreadCount, isLoading,
    handleMarkRead, handleMarkAllRead, loadNotifications,
  } = useNotification();

  const renderItem = ({ item }: { item: NotificationDTO }) => {
    const icon = TYPE_ICON[item.type] ?? { name: "notifications-outline", color: COLORS.muted };
    return (
      <TouchableOpacity
        style={[styles.item, !item.isRead && styles.itemUnread]}
        onPress={() => !item.isRead && handleMarkRead(item.id)}
        activeOpacity={0.75}
      >
        <View style={[styles.iconWrapper, { backgroundColor: icon.color + "22" }]}>
          <Ionicons name={icon.name as any} size={20} color={icon.color} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemBody}>{item.body}</Text>
          <Text style={styles.itemTime}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => `notif-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadNotifications} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default NotificationScreen;
