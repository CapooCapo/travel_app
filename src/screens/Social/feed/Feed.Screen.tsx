import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Feed.Style";
import { FeedFunction } from "./Feed.Function";
import { COLORS } from "../../../constants/theme";
import { FeedItemDTO } from "../../../dto/social/social.DTO";
import { UserDTO } from "../../../dto/auth/user.DTO";

const TYPE_META: Record<string, { icon: string; color: string }> = {
  rating:     { icon: "star",            color: "#f5a623" },
  event_join: { icon: "calendar",        color: COLORS.primary },
  bookmark:   { icon: "bookmark",        color: "#00c864" },
  review:     { icon: "chatbubble",      color: "#7c6af7" },
};

const FeedScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { 
    feedItems, isLoading, 
    searchKeyword, setSearchKeyword,
    searchResults, isSearching,
    handleLoadMore, navigateToTarget, navigateToUser, refresh 
  } = FeedFunction(navigation);

  const renderFeedItem = ({ item }: { item: FeedItemDTO }) => {
    const meta = TYPE_META[item.type] ?? { icon: "ellipse", color: COLORS.muted };
    const initial = item.userName?.charAt(0)?.toUpperCase() ?? "?";

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigateToTarget(item)}
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

  const renderUserItem = ({ item }: { item: UserDTO }) => {
    const initial = item.fullName?.charAt(0)?.toUpperCase() ?? "?";

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => navigateToUser(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{initial}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.fullName}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>

        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Nếu đang tìm kiếm, dùng list search kết quả
  const isSearchActive = searchKeyword.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.muted} style={styles.searchIcon} />
          <TextInput
            placeholder="Find friends..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            autoCapitalize="none"
          />
          {searchKeyword.length > 0 && (
            <TouchableOpacity onPress={() => setSearchKeyword("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={(isSearchActive ? searchResults : feedItems) as any[]}
        renderItem={({ item }) => isSearchActive ? renderUserItem({ item: item as UserDTO }) : renderFeedItem({ item: item as FeedItemDTO })}
        keyExtractor={(item) => `social-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !isSearchActive}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
        ListFooterComponent={
          (isLoading || isSearching)
            ? <View style={styles.footerLoader}><ActivityIndicator color={COLORS.primary} /></View>
            : null
        }
        ListEmptyComponent={
          !(isLoading || isSearching) ? (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name={isSearchActive ? "search-outline" : "people-outline"} 
                size={52} 
                color={COLORS.muted} 
              />
              <Text style={styles.emptyText}>
                {isSearchActive ? "No users found" : "Nothing here yet"}
              </Text>
              <Text style={styles.emptySubText}>
                {isSearchActive 
                  ? "Try searching for another name or email" 
                  : "Follow other travelers to see their activity"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default FeedScreen;
