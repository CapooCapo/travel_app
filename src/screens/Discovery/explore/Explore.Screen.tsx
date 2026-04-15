import React, { useEffect } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, StatusBar, Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Explore.Style";
import { useExplore, CATEGORIES } from "./useExplore";
import { COLORS } from "../../../constants/theme";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { PlaceCard } from "../../../components/Discovery/PlaceCard";
import { SearchBar } from "../../../components/Common/SearchBar";
import FilterModal from "../../../components/Discovery/FilterModal";

// ─── Screen ───────────────────────────────────────────────────────────────────
const ExploreScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);

  const {
    places, isLoading, keyword, setKeyword,
    selectedCategories, setSelectedCategories,
    selectedRadius, setSelectedRadius,
    recentSearches, handleSearch, handleLoadMore,
    navigateToDetail, loadRecentSearches, fetchPlaces,
    isBookmarksMode, setIsBookmarksMode,
  } = useExplore(navigation);

  useEffect(() => {
    const isSaved = route.params?.bookmarks === true;
    setIsBookmarksMode(isSaved);
    loadRecentSearches();
  }, [route.params?.bookmarks]);

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
        {isBookmarksMode && (
          <TouchableOpacity 
            onPress={() => {
              setIsBookmarksMode(false);
              navigation.setParams({ bookmarks: false });
            }}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {isBookmarksMode ? "Saved Places" : "Explore"}
        </Text>
      </View>

      {/* Search Bar & Filter Button - Only show in normal mode */}
      {!isBookmarksMode && (
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <SearchBar
                value={keyword}
                onChangeText={setKeyword}
                onClear={() => { setKeyword(""); fetchPlaces(true); }}
                onSubmitEditing={handleSearch}
                placeholder="Search locations…"
                style={{ marginHorizontal: 0, marginLeft: 20 }}
              />
            </View>
            <TouchableOpacity 
              onPress={() => setIsFilterVisible(true)}
              style={[
                styles.filterBtn, 
                (selectedCategories.length > 0 || selectedRadius) && styles.filterBtnActive
              ]}
            >
              <Ionicons 
                name="options-outline" 
                size={22} 
                color={(selectedCategories.length > 0 || selectedRadius) ? "#000" : COLORS.text} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        categories={CATEGORIES}
        initialCategories={selectedCategories}
        initialRadius={selectedRadius}
        onApply={(filters) => {
          setSelectedCategories(filters.categories);
          setSelectedRadius(filters.radius);
          fetchPlaces(true);
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

      {/* Global Loading Overlay */}
      {isLoading && places.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching locations...</Text>
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
              <Text style={styles.emptyText}>No locations found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default ExploreScreen;
