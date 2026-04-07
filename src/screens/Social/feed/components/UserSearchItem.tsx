import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../Feed.Style";
import { UserDTO } from "../../../../dto/auth/user.DTO";

interface UserSearchItemProps {
  item: UserDTO;
  onPress: (userId: number) => void;
}

export const UserSearchItem: React.FC<UserSearchItemProps> = ({ item, onPress }) => {
  const initial = item.fullName?.charAt(0)?.toUpperCase() ?? "?";

  const handlePress = () => {
    // [FE DEBUG] Selected search result - userId
    console.log('[FE DEBUG] Selected search result - userId:', item.id);
    onPress(item.id);
  };

  return (
    <TouchableOpacity
      style={styles.userItem}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{initial}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>

      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
