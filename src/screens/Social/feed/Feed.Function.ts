import { useState, useEffect, useCallback } from "react";
import { socialService } from "../../../services/social.service";
import { FeedItemDTO } from "../../../dto/social/social.DTO";

export function FeedFunction(navigation: any) {
  const [feedItems, setFeedItems] = useState<FeedItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    if (hasMore && !isLoading) loadFeed();
  };

  const navigateToTarget = (item: FeedItemDTO) => {
    if (item.targetType === "place")
      navigation.navigate("PlaceDetail", { placeId: item.targetId });
    else
      navigation.navigate("EventDetail", { eventId: item.targetId });
  };

  return {
    feedItems, isLoading,
    handleLoadMore, navigateToTarget,
    refresh: () => loadFeed(true),
  };
}
