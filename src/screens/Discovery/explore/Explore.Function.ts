import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { discoveryService } from "../../../services/discovery.service";
import { offlineStorage } from "../../../storage/offline.storage";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";

const CATEGORIES = ["all", "attraction", "cuisine", "activity"];
const SORT_OPTIONS = ["relevance", "top-rated", "name"] as const;

export function ExploreFunction(navigation: any) {
  const [places, setPlaces] = useState<PlaceDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>("relevance");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const loadRecentSearches = async () => {
    const searches = await offlineStorage.getRecentSearches();
    setRecentSearches(searches);
  };

  const fetchPlaces = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const res = await discoveryService.getPlaces({
          keyword: keyword.trim() || undefined,
          category: selectedCategory === "all" ? undefined : selectedCategory,
          sortBy,
          page: currentPage,
          limit: 10,
        });
        const newPlaces = res?.places ?? [];
        setPlaces(reset ? newPlaces : (prev) => [...prev, ...newPlaces]);
        setPage(currentPage + 1);
        setHasMore(newPlaces.length === 10);
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load places");
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, selectedCategory, sortBy, page, isLoading]
  );

  const handleSearch = async () => {
    if (keyword.trim()) {
      await offlineStorage.saveRecentSearch(keyword.trim());
    }
    setPage(1);
    fetchPlaces(true);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    setPlaces([]);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) fetchPlaces();
  };

  const navigateToDetail = (placeId: number) =>
    navigation.navigate("PlaceDetail", { placeId });

  return {
    places,
    isLoading,
    keyword,
    setKeyword,
    selectedCategory,
    sortBy,
    setSortBy,
    categories: CATEGORIES,
    sortOptions: SORT_OPTIONS,
    recentSearches,
    handleSearch,
    handleCategoryChange,
    handleLoadMore,
    navigateToDetail,
    loadRecentSearches,
    fetchPlaces,
  };
}
