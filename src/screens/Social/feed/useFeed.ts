import { useState, useEffect, useCallback } from "react";
import { socialService } from "../../../services/social.service";
import { debugService } from "../../../services/debug.service";
import { FeedItemDTO } from "../../../dto/social/social.DTO";
import { UserDTO } from "../../../dto/auth/user.DTO";

export function useFeed(navigation: any) {
  const [feedItems, setFeedItems] = useState<FeedItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (searchKeyword.trim().length > 1) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch(searchKeyword);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchKeyword]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      console.log(`[useFeed] Searching for: ${query}`);
      const data = await socialService.searchUsers(query, 20, 0);
      setSearchResults(data ?? []); // data is already the naked array from service
    } catch (e: any) {
      console.error("[useFeed] Search Error:", e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // [FE DEBUG] Trigger test queries via debugService
  useEffect(() => {
    const timer = setTimeout(() => {
      debugService.runUserSearchTests();
      debugService.runUserProfileTest(1); 
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { loadFeed(true); }, [selectedTypes]);

  const loadFeed = useCallback(async (reset = false) => {
    if (isLoading && !reset) return;
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      console.log(`[useFeed] Loading feed page: ${currentPage}, types: ${selectedTypes}`);
      const data = await socialService.getFeed(currentPage, selectedTypes.length > 0 ? selectedTypes : undefined);
      
      // Handle both array and PageRes object
      const items = (data as any)?.content ?? (Array.isArray(data) ? data : []);
      
      setFeedItems(reset ? items : (prev) => [...(prev ?? []), ...items]);
      setPage(currentPage + 1);
      setHasMore(items.length >= 10);
    } catch (err: any) {
      console.error("[useFeed] Load Feed Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && searchKeyword === "") loadFeed();
  };

  const navigateToTarget = (item: FeedItemDTO) => {
    if (item.targetType === "place")
      navigation.navigate("PlaceDetail", { placeId: item.targetId });
    else
      navigation.navigate("EventDetail", { eventId: item.targetId });
  };

  const navigateToUser = (userId: number) => {
    navigation.navigate("UserProfile", { userId });
  };

  return {
    feedItems, isLoading,
    searchKeyword, setSearchKeyword,
    searchResults, isSearching,
    selectedTypes, setSelectedTypes,
    handleLoadMore, navigateToTarget, navigateToUser,
    refresh: () => {
      setSearchKeyword("");
      loadFeed(true);
    },
  };
}
