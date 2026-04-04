import { useState, useEffect, useCallback } from "react";
import { socialService } from "../../../services/social.service";
import { FeedItemDTO } from "../../../dto/social/social.DTO";
import { UserDTO } from "../../../dto/auth/user.DTO";

export function FeedFunction(navigation: any) {
  const [feedItems, setFeedItems] = useState<FeedItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async (keyword: string) => {
    setIsSearching(true);
    try {
      const res = await socialService.searchUsers(keyword);
      // Giả sử API trả về Res<UserDTO[]> -> res.data là UserDTO[]
      setSearchResults(res.data || []);
    } catch (e) {
      console.error("[Feed] Search error:", e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => { loadFeed(true); }, []);

  const loadFeed = useCallback(async (reset = false) => {
    if (isLoading && !reset) return;
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await socialService.getFeed(currentPage);
      const items = res?.items ?? [];
      setFeedItems(reset ? items : (prev) => [...prev, ...items]);
      setPage(currentPage + 1);
      setHasMore(items.length >= 10);
    } catch {
      // Silently fail — feed is non-critical
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
    handleLoadMore, navigateToTarget, navigateToUser,
    refresh: () => {
      setSearchKeyword("");
      loadFeed(true);
    },
  };
}
