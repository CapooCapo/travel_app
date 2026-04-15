import { useState, useEffect, useCallback } from "react";
import { messagingService } from "../../../services/messaging.service";
import { socialService } from "../../../services/social.service";
import { UserDTO } from "../../../dto/auth/user.DTO";
import { Alert } from "react-native";

export function useCreateGroup(navigation: any) {
  const [groupName, setGroupName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Record<number, UserDTO>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchKeyword.trim().length > 1) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch(searchKeyword);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await socialService.searchUsers(query, 20, 0);
      setSearchResults(res || []);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleUserSelection = (user: UserDTO) => {
    setSelectedUsers((prev) => {
      const next = { ...prev };
      if (next[user.id]) {
        delete next[user.id];
      } else {
        next[user.id] = user;
      }
      return next;
    });
  };

  const handleCreate = async () => {
    const memberIds = Object.keys(selectedUsers).map(Number);
    
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }
    if (memberIds.length < 2) {
      Alert.alert("Error", "Please select at least 2 members");
      return;
    }

    setIsLoading(true);
    try {
      console.log('[FE DEBUG] CREATE_GROUP_CLICKED', { name: groupName, memberIds });
      const newChat = await messagingService.createGroupChat(groupName, memberIds);
      console.log('[FE DEBUG] API response:', newChat);
      
      navigation.replace("ChatRoom", {
        chatRoomId: newChat.id,
        chatName: newChat.name,
        chatType: "group"
      });
    } catch (error: any) {
      console.error('[FE DEBUG] Group creation failed:', error);
      Alert.alert("Error", error.message || "Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    groupName, setGroupName,
    searchKeyword, setSearchKeyword,
    searchResults, isSearching,
    selectedUsers, toggleUserSelection,
    isLoading, handleCreate,
    goBack: () => navigation.goBack(),
  };
}
