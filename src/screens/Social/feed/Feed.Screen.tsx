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
import SocialFilterModal from "../../../components/Social/SocialFilterModal";
import { Skeleton } from "../../../components/Common/Skeleton";

const FeedSkeleton = () => (
  <View style={{ padding: 20 }}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={{ marginBottom: 20, flexDirection: 'row', gap: 12 }}>
        <Skeleton width={50} height={50} borderRadius={25} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="90%" height={12} />
          <Skeleton width="70%" height={12} />
        </View>
      </View>
    ))}
  </View>
);

const FeedScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);

  const { 
    feedItems, isLoading, 
    searchKeyword, setSearchKeyword,
    searchResults, isSearching,
    selectedTypes, setSelectedTypes,
    handleLoadMore, navigateToTarget, navigateToUser, refresh 
  } = useFeed(navigation);

  // Nếu đang tìm kiếm, dùng list search kết quả
  const isSearchActive = searchKeyword.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.headerTitle}>Social Feed</Text>
          <TouchableOpacity 
            onPress={() => setIsFilterVisible(true)}
            style={{ 
              backgroundColor: selectedTypes.length > 0 ? COLORS.primary : COLORS.surface,
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLORS.border
            }}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={selectedTypes.length > 0 ? "#fff" : COLORS.text} 
            />
          </TouchableOpacity>
        </View>
        
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

      <SocialFilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        initialTypes={selectedTypes}
        onApply={setSelectedTypes}
      />

      {isLoading && feedItems.length === 0 ? (
        <FeedSkeleton />
      ) : (
        <FlatList
          data={(isSearchActive ? searchResults : feedItems) as any[]}
          renderItem={({ item }) => 
            isSearchActive 
              ? <UserSearchItem item={item as UserDTO} onPress={navigateToUser} />
              : <FeedItem 
                  item={item as FeedItemDTO} 
                  onPress={navigateToTarget}
                  onFollow={navigateToUser} 
                />
          }
          keyExtractor={(item) => `social-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && feedItems.length > 0}
              onRefresh={refresh}
              tintColor={COLORS.primary}
            />
          }
          ListFooterComponent={
            (isLoading && feedItems.length > 0) || isSearching
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
      )}
    </View>
  );
};

export default FeedScreen;
