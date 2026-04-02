import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { discoveryService } from "../../../services/discovery.service";
import { offlineStorage } from "../../../storage/offline.storage";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";

const PAGE_SIZE = 10;

export const CATEGORIES = [
  "Food", "Nature", "Culture", "Beach", "Museum", "Shopping", "Adventure", "Park",
];

export function ExploreFunction(navigation: any) {
  const [places,            setPlaces]           = useState<PlaceDTO[]>([]);
  const [isLoading,         setIsLoading]        = useState(false);
  const [keyword,           setKeyword]          = useState("");
  const [selectedCategory,  setSelectedCategory] = useState("");
  const [page,              setPage]             = useState(0);
  const [totalPages,        setTotalPages]       = useState(1);
  const [recentSearches,    setRecentSearches]   = useState<string[]>([]);

  const hasMore = page < totalPages - 1;

  const loadRecentSearches = async () => {
    const searches = await offlineStorage.getRecentSearches();
    setRecentSearches(searches);
  };

  const fetchPlaces = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const currentPage = reset ? 0 : page;
        const res = await discoveryService.getAttractions({
          keyword: keyword.trim() || undefined,
          page:    currentPage,
          size:    PAGE_SIZE,
        });
        const newPlaces = res.places ?? [];
        setPlaces(reset ? newPlaces : (prev) => [...prev, ...newPlaces]);
        setPage(reset ? 1 : currentPage + 1);
        setTotalPages(res.totalPages);
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load places");
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, page, isLoading]
  );

  const handleSearch = async () => {
    if (keyword.trim()) {
      await offlineStorage.saveRecentSearch(keyword.trim());
    }
    setPage(0);
    setPlaces([]);
    fetchPlaces(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) fetchPlaces(false);
  };

  const navigateToDetail = (placeId: number) =>
    navigation.navigate("PlaceDetail", { placeId });

  return {
    places,
    isLoading,
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    recentSearches,
    hasMore,
    handleSearch,
    handleLoadMore,
    navigateToDetail,
    loadRecentSearches,
    fetchPlaces,
  };
}
