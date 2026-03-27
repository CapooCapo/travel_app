import React, { useEffect } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  Image, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Explore.Style";
import { ExploreFunction } from "./Explore.Function";
import { COLORS } from "../../../constants/theme";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";

const ExploreScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    places, isLoading, keyword, setKeyword,
    selectedCategory, categories, recentSearches,
    handleSearch, handleCategoryChange, handleLoadMore,
    navigateToDetail, loadRecentSearches, fetchPlaces,
  } = ExploreFunction(navigation);

  useEffect(() => {
    loadRecentSearches();
    fetchPlaces(true);
  }, []);

  const renderCard = ({ item }: { item: PlaceDTO }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateToDetail(item.id)} activeOpacity={0.8}>
      <Image
        source={{ uri: item.imageUrls?.[0] ?? "https://via.placeholder.com/90" }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardRating}>
            <Ionicons name="star" size={12} color={COLORS.primary} />
            <Text style={styles.cardRatingText}>{item.rating?.toFixed(1)}</Text>
            <Text style={styles.cardRatingText}> ({item.reviewCount})</Text>
          </View>
          <View style={styles.cardPriceTag}>
            <Text style={styles.cardPriceText}>
              {item.priceRange === "free" ? "Free" : item.priceRange}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const showRecent = !keyword && recentSearches.length > 0 && places.length === 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places, cuisines…"
          placeholderTextColor={COLORS.muted}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => { setKeyword(""); fetchPlaces(true); }}>
            <Ionicons name="close-circle" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Chips */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
            onPress={() => handleCategoryChange(item)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === item && styles.categoryChipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Recent Searches */}
      {showRecent && (
        <View>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>RECENT SEARCHES</Text>
          </View>
          {recentSearches.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.recentItem}
              onPress={() => { setKeyword(s); handleSearch(); }}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.muted} />
              <Text style={styles.recentText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      <FlatList
        data={places}
        renderItem={renderCard}
        keyExtractor={(item) => `place-${item.id}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No places found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default ExploreScreen;
