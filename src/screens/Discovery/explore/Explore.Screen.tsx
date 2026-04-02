import React, { useEffect } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, StatusBar, Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Explore.Style";
import { ExploreFunction, CATEGORIES } from "./Explore.Function";
import { COLORS } from "../../../constants/theme";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";

// ─── Same photo pool helper used in Home ─────────────────────────────────────
const PHOTO_POOLS: Record<string, string[]> = {
  food:       ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400"],
  restaurant: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400", "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=400", "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=400"],
  nature:     ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400", "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=400"],
  beach:      ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400", "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400", "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=400"],
  culture:    ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400", "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=400", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400"],
  museum:     ["https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=400", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400", "https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=400"],
  shopping:   ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400", "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=400", "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=400"],
  adventure:  ["https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=400", "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=400", "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=400"],
  default:    ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400", "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=400"],
};

function getPlaceImage(name: string, category?: string): string {
  const key = category?.toLowerCase() ?? "";
  const pool =
    PHOTO_POOLS[key] ??
    Object.entries(PHOTO_POOLS).find(([k]) => key.includes(k))?.[1] ??
    PHOTO_POOLS.default;
  const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
  return pool[index];
}

// ─── Screen ───────────────────────────────────────────────────────────────────
const ExploreScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    places, isLoading, keyword, setKeyword,
    selectedCategory, setSelectedCategory,
    recentSearches, handleSearch, handleLoadMore,
    navigateToDetail, loadRecentSearches, fetchPlaces,
  } = ExploreFunction(navigation);

  useEffect(() => {
    loadRecentSearches();
    fetchPlaces(true);
  }, []);

  const renderCard = ({ item }: { item: PlaceDTO }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToDetail(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getPlaceImage(item.name, item.category) }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="location-outline" size={12} color={COLORS.muted} />
          <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.cardRating}>
            <Ionicons name="star" size={12} color={COLORS.primary} />
            <Text style={styles.cardRatingText}>
              {item.rating > 0 ? item.rating.toFixed(1) : "New"}
            </Text>
          </View>
          {item.category && (
            <View style={styles.cardCategory}>
              <Text style={styles.cardCategoryText}>{item.category}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const showRecent = !keyword && recentSearches.length > 0 && places.length === 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search attractions…"
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
        data={CATEGORIES}
        horizontal
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item: cat }) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => {
                setSelectedCategory(cat === selectedCategory ? "" : cat);
                fetchPlaces(true);
              }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        }}
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
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No attractions found</Text>
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
