import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ChatList.Style";
import { ChatListFunction } from "./ChatList.Function";
import { COLORS } from "../../../constants/theme";
import { ChatDTO } from "../../../dto/messaging/message.DTO";

const ChatListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { chats, isLoading, totalUnread, navigateToChatRoom, loadChats } =
    ChatListFunction(navigation);

  const renderItem = ({ item }: { item: ChatDTO }) => {
    const initial =
      item.type === "group"
        ? (item.name?.charAt(0) ?? "G").toUpperCase()
        : (item.participants[0]?.userName?.charAt(0) ?? "?").toUpperCase();
    const displayName =
      item.type === "group"
        ? item.name ?? "Group Chat"
        : item.participants.map((p) => p.userName).join(", ");

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigateToChatRoom(item)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          {item.type === "group" && (
            <View style={styles.groupDot}>
              <Ionicons name="people" size={8} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.chatName} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.content ?? "No messages yet"}
          </Text>
        </View>

        <View style={styles.chatMeta}>
          {item.lastMessage && (
            <Text style={styles.chatTime}>
              {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit", minute: "2-digit",
              })}
            </Text>
          )}
          {item.unreadCount > 0 && (
            <View style={styles.unreadCount}>
              <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {totalUnread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{totalUnread}</Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />
      ) : (
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => `chat-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadChats} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={52} color={COLORS.muted} />
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubText}>
                Join an event to start chatting with organizers
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ChatListScreen;
