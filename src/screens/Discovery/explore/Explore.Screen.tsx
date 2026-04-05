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
import { getPlaceImage } from "../../../utils/imageUtils";
import { PlaceCard } from "../../../components/Discovery/PlaceCard";
import { SearchBar } from "../../../components/Common/SearchBar";

// Local PHOTO_POOLS and getPlaceImage have been moved to src/utils/imageUtils.ts


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
    <PlaceCard
        id={item.id.toString()}
        name={item.name}
        address={item.address}
        category={item.category}
        rating={item.rating}
        onPress={() => navigateToDetail(item.id)}
        variant="vertical"
    />
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
      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        onClear={() => { setKeyword(""); fetchPlaces(true); }}
        onSubmitEditing={handleSearch}
        placeholder="Search attractions…"
        style={{ marginBottom: 16 }}
      />

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
