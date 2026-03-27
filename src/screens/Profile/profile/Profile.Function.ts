import { useState } from "react";
import { Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { authStorage } from "../../../storage/auth.storage";

const INTEREST_OPTIONS = ["food", "culture", "shopping", "nature", "adventure"];
const TRAVEL_STYLES = ["solo", "family", "group"];

export function ProfileFunction(navigation: any) {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [travelStyle, setTravelStyle] = useState("solo");
  const [interests, setInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await user?.update({ firstName: fullName.trim() });
      setIsEditing(false);
      Alert.alert("Saved", "Profile updated successfully");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await authStorage.clear();
            await signOut();
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Sign out failed");
          }
        },
      },
    ]);
  };

  const navigateToItineraries = () => navigation.navigate("Itinerary");
  const navigateToBookmarks = () => navigation.navigate("Explore");

  return {
    user,
    isEditing,
    setIsEditing,
    fullName,
    setFullName,
    travelStyle,
    setTravelStyle,
    interests,
    toggleInterest,
    isSaving,
    handleSave,
    handleSignOut,
    navigateToItineraries,
    navigateToBookmarks,
    interestOptions: INTEREST_OPTIONS,
    travelStyles: TRAVEL_STYLES,
  };
}
