import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { discoveryService } from "../../../services/discovery.service";
import { offlineStorage } from "../../../storage/offline.storage";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";

const PAGE_SIZE = 10;

export const CATEGORIES = [
  "Food", "Nature", "Culture", "Beach", "Museum", "Shopping", "Adventure", "Park",
];

export function useExplore(navigation: any) {
  // ─── Separate States (Isolation) ───
  const [explorePlaces,   setExplorePlaces]   = useState<PlaceDTO[]>([]);
  const [savedPlaces,     setSavedPlaces]     = useState<PlaceDTO[]>([]);
  
  const [isLoading,         setIsLoading]        = useState(false);
  const [keyword,           setKeyword]          = useState("");
  const [debouncedKeyword,  setDebouncedKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRadius,    setSelectedRadius]   = useState<number | null>(null);
  const [page,              setPage]             = useState(0);
  const [totalPages,        setTotalPages]       = useState(1);
  const [recentSearches,    setRecentSearches]   = useState<string[]>([]);
  const [isBookmarksMode,   setIsBookmarksMode]  = useState(false);

  // 300ms Debounce for keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Derived state for the UI
  const places = isBookmarksMode ? savedPlaces : explorePlaces;
  const hasMore = page < totalPages - 1 && !isBookmarksMode;

  const loadRecentSearches = async () => {
    const searches = await offlineStorage.getRecentSearches();
    setRecentSearches(searches);
  };

  // Automatically fetch data when filters or debounced keyword changes
  useEffect(() => {
    if (!isBookmarksMode) {
      fetchPlaces(true);
    }
  }, [debouncedKeyword, selectedCategories, selectedRadius, isBookmarksMode]);

  const fetchPlaces = useCallback(
    async (reset = false) => {
      if (isLoading && !reset) return;
      
      setIsLoading(true);
      const currentPage = reset ? 0 : page;

      try {
        if (isBookmarksMode) {
          const bookmarkedPlaces = await discoveryService.getBookmarks();
          setSavedPlaces(bookmarkedPlaces);
          setTotalPages(1);
          setPage(1);
        } else {
          let lat: number | undefined;
          let lng: number | undefined;

          // Only request location if radius is active OR we want nearby default
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({ 
                accuracy: Location.Accuracy.Balanced 
            });
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
          }

          const res = await discoveryService.getLocations({
            keyword: debouncedKeyword.trim() || undefined,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            lat,
            lng,
            radius: selectedRadius || undefined,
            page: currentPage,
            size: PAGE_SIZE,
          });

          const newPlaces = res.places ?? [];
          setExplorePlaces(reset ? newPlaces : (prev) => [...prev, ...newPlaces]);
          setPage(reset ? 1 : currentPage + 1);
          setTotalPages(res.totalPages);
        }
      } catch (e: any) {
        console.error("[useExplore] Fetch error:", e);
        if (e?.message !== "Canceled") {
            Alert.alert("Error", e?.message || "Failed to load places");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedKeyword, selectedCategories, selectedRadius, isBookmarksMode, page, isLoading]
  );

  const handleSearch = async () => {
    if (keyword.trim()) {
      await offlineStorage.saveRecentSearch(keyword.trim());
    }
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
    selectedCategories,
    setSelectedCategories,
    selectedRadius,
    setSelectedRadius,
    recentSearches,
    hasMore,
    isBookmarksMode,
    setIsBookmarksMode,
    handleSearch,
    handleLoadMore,
    navigateToDetail,
    loadRecentSearches,
    fetchPlaces,
  };
}
