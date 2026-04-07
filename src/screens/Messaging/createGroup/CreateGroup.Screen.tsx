import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./CreateGroup.Style";
import { useCreateGroup } from "./useCreateGroup";
import { COLORS } from "../../../constants/theme";
import { UserDTO } from "../../../dto/auth/user.DTO";

const CreateGroupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    groupName, setGroupName,
    searchKeyword, setSearchKeyword,
    searchResults, isSearching,
    selectedUsers, toggleUserSelection,
    isLoading, handleCreate,
    goBack,
  } = useCreateGroup(navigation);

  const selectedCount = Object.keys(selectedUsers).length;

  const renderUserItem = ({ item }: { item: UserDTO }) => {
    const isSelected = !!selectedUsers[item.id];
    const initial = item.fullName?.charAt(0)?.toUpperCase() ?? "?";

    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.userItemActive]}
        onPress={() => toggleUserSelection(item)}
      >
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{initial}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.fullName}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Group</Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, (selectedCount < 2 || !groupName.trim() || isLoading) && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={selectedCount < 2 || !groupName.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>Group Name</Text>
        <TextInput
          placeholder="Name your group..."
          placeholderTextColor={COLORS.muted}
          style={styles.nameInput}
          value={groupName}
          onChangeText={setGroupName}
        />

        <Text style={styles.inputLabel}>Select Members (Add {Math.max(0, 2 - selectedCount)} more)</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            placeholder="Search friends..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            autoCapitalize="none"
          />
        </View>
      </View>

      {selectedCount > 0 && (
        <Text style={styles.selectedCount}>{selectedCount} users selected</Text>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderUserItem}
        keyExtractor={(item) => `user-${item.id}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isSearching && searchKeyword.length > 1 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          ) : isSearching ? (
            <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />
          ) : null
        }
      />
    </View>
  );
};

export default CreateGroupScreen;
