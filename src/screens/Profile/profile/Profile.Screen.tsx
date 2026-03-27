import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Image, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Profile.Style";
import { ProfileFunction } from "./Profile.Function";
import { COLORS } from "../../../constants/theme";

const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    user, isEditing, setIsEditing, fullName, setFullName,
    travelStyle, setTravelStyle, interests, toggleInterest,
    isSaving, handleSave, handleSignOut, navigateToItineraries,
    navigateToBookmarks, interestOptions, travelStyles,
  } = ProfileFunction(navigation);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBg}>
          {!isEditing && (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
          <View style={styles.avatar}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={36} color={COLORS.muted} />
            )}
          </View>
          <Text style={styles.displayName}>{user?.fullName ?? "Traveler"}</Text>
          <Text style={styles.emailText}>
            {user?.primaryEmailAddress?.emailAddress ?? ""}
          </Text>
        </View>

        {/* Travel Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Style</Text>
          <View style={styles.styleRow}>
            {travelStyles.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.styleChip, travelStyle === s && styles.styleChipActive]}
                onPress={() => isEditing && setTravelStyle(s)}
                disabled={!isEditing}
              >
                <Text style={[styles.styleChipText, travelStyle === s && styles.styleChipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestRow}>
            {interestOptions.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[styles.interestChip, interests.includes(interest) && styles.interestChipActive]}
                onPress={() => isEditing && toggleInterest(interest)}
                disabled={!isEditing}
              >
                <Text style={[styles.interestChipText, interests.includes(interest) && styles.interestChipTextActive]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Name (edit mode) */}
        {isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Display Name</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor={COLORS.muted}
              />
            </View>
          </View>
        )}

        {/* Quick actions */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Travel</Text>
            {[
              { icon: "map-outline", label: "My Itineraries", onPress: navigateToItineraries },
              { icon: "bookmark-outline", label: "Saved Places", onPress: navigateToBookmarks },
            ].map(({ icon, label, onPress }) => (
              <TouchableOpacity key={label} style={styles.menuItem} onPress={onPress}>
                <Ionicons name={icon as any} size={20} color={COLORS.primary} />
                <Text style={styles.menuItemText}>{label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Save / Cancel buttons (edit mode) */}
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
              {isSaving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Save Changes</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.signOutBtn} onPress={() => setIsEditing(false)}>
              <Text style={[styles.signOutText, { color: COLORS.muted }]}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
