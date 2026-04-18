import { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { socialService } from "../../../services/social.service";
import { debugService } from "../../../services/debug.service";
import { FeedItemDTO } from "../../../dto/social/social.DTO";
import { UserDTO } from "../../../dto/auth/user.DTO";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@clerk/clerk-expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.72:8080";
const WS_URL = BASE_URL.replace(/^http/, "ws") + "/ws";

export function useFeed(navigation: any) {
  const [feedItems, setFeedItems] = useState<FeedItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const { getToken } = useAuth();
  const isFocused = useIsFocused();

  // 🔄 Deep Refresh on Focus
  useEffect(() => {
    if (isFocused) {
      console.log("[useFeed] Screen focused, triggering refresh...");
      loadFeed(true);
    }
  }, [isFocused]);

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

  // 🔔 Real-time Feed Updates via WebSocket
  useEffect(() => {
    let client: Client;
    
    const connectStomp = async () => {
      const token = await getToken({ template: 'jwt-template-account' });
      if (!token) return;

      client = new Client({
        brokerURL: WS_URL,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("[STOMP-FEED] Connected");
          client.subscribe("/user/queue/activities", (msg) => {
            console.log("[STOMP-FEED] Received update, refreshing feed...");
            // We could parse the payload to add the item directly,
            // but for data consistency and simplicity, we trigger a refresh.
            loadFeed(true); 
          });
        },
        onStompError: (frame) => console.error("[STOMP-FEED] Error:", frame.body),
      });

      client.activate();
      setStompClient(client);
    };

    connectStomp();

    return () => {
      if (client) client.deactivate();
    };
  }, []);

  useEffect(() => { loadFeed(true); }, [selectedTypes]);

  const loadFeed = useCallback(async (reset = false) => {
    if (isLoading && !reset) return;
    setIsLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      console.log(`[useFeed] Loading feed page: ${currentPage}, types: ${selectedTypes}`);
      console.log(`[FEED] Requesting page: ${currentPage}`);
      const data = await socialService.getFeed(currentPage, selectedTypes.length > 0 ? selectedTypes : undefined);
      
      console.log("[FEED DEBUG] API Response Data:", data);

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
    const type = item.targetType;
    if (type === "LOCATION")
      navigation.navigate("PlaceDetail", { placeId: item.targetId });
    else if (type === "EVENT")
      navigation.navigate("EventDetail", { eventId: item.targetId });
    else if (type === "USER")
      navigation.navigate("UserProfile", { userId: item.targetId });
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
