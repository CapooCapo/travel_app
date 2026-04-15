import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { styles } from "./ChatList.Style";
import { useChatList } from "./useChatList";
import { COLORS } from "../../../constants/theme";
import { ChatDTO } from "../../../dto/messaging/message.DTO";

const ChatListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user: clerkUser } = useUser();
  const currentUserId = clerkUser?.id; // Clerk ID is string, but our DB uses parsed Long. 
  // However, most screens use publicMetadata.userId or similar for numeric ID if synced.
  // For now, we'll try to match by name or fallback.
  
  const { chats, isLoading, totalUnread, navigateToChatRoom, loadChats } =
    useChatList(navigation);

  const renderItem = ({ item }: { item: ChatDTO }) => {
    const isGroup = item.type === "GROUP";
    
    // Logic for Private Chat: Find the OTHER participant
    const otherParticipant = !isGroup 
      ? item.participants.find(p => p.fullName !== clerkUser?.fullName) 
      : null;

    const initial = isGroup
        ? (item.name?.charAt(0) ?? "G").toUpperCase()
        : (otherParticipant?.fullName?.charAt(0) ?? item.participants[0]?.fullName?.charAt(0) ?? "?").toUpperCase();

    const displayName = isGroup
        ? item.name ?? "Group Chat"
        : otherParticipant?.fullName || item.participants[0]?.fullName || "User";

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
          {isGroup && (
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
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.createGroupBtn}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Ionicons name="add-circle-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
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
