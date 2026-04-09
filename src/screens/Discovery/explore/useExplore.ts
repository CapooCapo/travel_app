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
  const [selectedCategory,  setSelectedCategory] = useState("");
  const [page,              setPage]             = useState(0);
  const [totalPages,        setTotalPages]       = useState(1);
  const [recentSearches,    setRecentSearches]   = useState<string[]>([]);
  const [isBookmarksMode,   setIsBookmarksMode]  = useState(false);

  // Derived state for the UI
  const places = isBookmarksMode ? savedPlaces : explorePlaces;
  const hasMore = page < totalPages - 1 && !isBookmarksMode;

  const loadRecentSearches = async () => {
    const searches = await offlineStorage.getRecentSearches();
    setRecentSearches(searches);
  };

  // Automatically fetch data when mode or filters change
  useEffect(() => {
    fetchPlaces(true);
  }, [isBookmarksMode, keyword, selectedCategory]);

  const fetchPlaces = useCallback(
    async (reset = false) => {
      // If we are already loading and it's NOT a reset (mode change/filter change), skip
      if (isLoading && !reset) return;
      
      setIsLoading(true);

      const currentPage = reset ? 0 : page;

      try {
        if (isBookmarksMode) {
          // ─── SAVED PLACES MODE ───
          console.log("[useExplore] Fetching Bookmarks...");
          const bookmarkedPlaces = await discoveryService.getBookmarks();
          console.log("SavedPlaces:", bookmarkedPlaces); // Debug log as requested
          
          setSavedPlaces(bookmarkedPlaces);
          setTotalPages(1);
          setPage(1);
        } else {
          // ─── EXPLORE MODE (Proximity Filtering) ───
          let res;
          
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const { latitude, longitude } = loc.coords;

            console.log(`[useExplore] Fetching Nearby (Explore): ${latitude}, ${longitude}`);
            const nearbyRes = await discoveryService.getNearby(latitude, longitude); 
            res = { places: nearbyRes, totalPages: 1 };
          } else {
            console.warn("[useExplore] Location denied. Falling back to global search.");
            res = await discoveryService.getLocations({
              keyword: keyword.trim() || undefined,
              category: selectedCategory || undefined,
              page: currentPage,
              size: PAGE_SIZE,
            });
          }

          const newPlaces = res.places ?? [];
          setExplorePlaces(reset ? newPlaces : (prev) => [...prev, ...newPlaces]);
          setPage(reset ? 1 : currentPage + 1);
          setTotalPages(res.totalPages);
        }
      } catch (e: any) {
        console.error("[useExplore] Fetch error:", e);
        // Avoid alerting on rapid switching errors if they are just cancelled requests
        if (e?.message !== "Canceled") {
            Alert.alert("Error", e?.message || "Failed to load places");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, selectedCategory, isBookmarksMode, page, isLoading]
  );

  const handleSearch = async () => {
    if (keyword.trim()) {
      await offlineStorage.saveRecentSearch(keyword.trim());
    }
    setPage(0);
    // Clear only the active mode's state
    if (isBookmarksMode) {
      setSavedPlaces([]);
    } else {
      setExplorePlaces([]);
    }
    fetchPlaces(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) fetchPlaces(false);
  };

  const navigateToDetail = (placeId: number) =>
    navigation.navigate("PlaceDetail", { placeId });

  return {
    places, // Computed result for UI
    isLoading,
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
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
