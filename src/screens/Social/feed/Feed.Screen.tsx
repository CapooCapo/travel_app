import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Feed.Style";
import { useFeed } from "./useFeed";
import { COLORS } from "../../../constants/theme";
import { FeedItemDTO } from "../../../dto/social/social.DTO";
import { UserDTO } from "../../../dto/auth/user.DTO";

import { FeedItem } from "./components/FeedItem";
import { UserSearchItem } from "./components/UserSearchItem";

const FeedScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { 
    feedItems, isLoading, 
    searchKeyword, setSearchKeyword,
    searchResults, isSearching,
    handleLoadMore, navigateToTarget, navigateToUser, refresh 
  } = useFeed(navigation);

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
        renderItem={({ item }) => 
          isSearchActive 
            ? <UserSearchItem item={item as UserDTO} onPress={navigateToUser} />
            : <FeedItem item={item as FeedItemDTO} onPress={navigateToTarget} />
        }
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
