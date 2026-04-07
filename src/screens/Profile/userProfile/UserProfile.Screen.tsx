import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { styles } from "./UserProfile.Style";
import { useUserProfile } from "./useUserProfile";
import { COLORS } from "../../../constants/theme";

const UserProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { userId } = (route.params as { userId: number }) || {};

  // [FE DEBUG] Opening profile for specific userId
  console.log("[FE DEBUG] Opening profile for userId:", userId);

  const {
    user,
    isLoading,
    isFollowing,
    handleFollowChange,
    handleMessage,
  } = useUserProfile(userId, navigation);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      
      {/* ── Custom Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.fullName}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Avatar & Bio ── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color={COLORS.muted} />
              </View>
            )}
          </View>
          <Text style={styles.displayName}>{user.fullName}</Text>
          <Text style={styles.usernameText}>@{user.username || "traveler"}</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.followBtn, isFollowing && styles.followingBtn]} 
              onPress={handleFollowChange}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.messageBtn}
              onPress={handleMessage}
            >
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followerCount || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followingCount || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* ── Interests ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestRow}>
            {user.interests && user.interests.length > 0 ? (
              user.interests.map((interest: any, index: number) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestChipText}>
                    {typeof interest === 'string' ? interest : interest.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No interests listed</Text>
            )}
          </View>
        </View>

        {/* ── Travel Style ── */}
        {user.travelStyle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Style</Text>
            <View style={styles.styleChip}>
              <Text style={styles.styleChipText}>{user.travelStyle}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default UserProfileScreen;
