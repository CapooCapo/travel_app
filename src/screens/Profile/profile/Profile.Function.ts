import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { apiRequest } from "../../../api/client";
import { authStorage } from "../../../storage/auth.storage";
import { UserDTO } from "../../../dto/auth/user.DTO";

const TRAVEL_STYLES = ["SOLO", "FAMILY", "GROUP"] as const;
const GENDERS       = ["MALE", "FEMALE", "OTHER"] as const;

export function ProfileFunction(navigation: any) {
  const { signOut }  = useAuth();
  const { user }     = useUser();

  const [beUser,      setBeUser]      = useState<UserDTO | null>(null);
  const [isEditing,   setIsEditing]   = useState(false);
  const [isSaving,    setIsSaving]    = useState(false);
  const [isLoadingBe, setIsLoadingBe] = useState(true);

  // Editable fields (synced from beUser)
  const [fullName,    setFullName]    = useState("");
  const [travelStyle, setTravelStyle] = useState<typeof TRAVEL_STYLES[number]>("SOLO");
  const [gender,      setGender]      = useState<typeof GENDERS[number]>("OTHER");

  // Load BE user profile on mount
  useEffect(() => {
    loadBeProfile();
  }, []);

  const loadBeProfile = async () => {
    setIsLoadingBe(true);
    try {
      // GET /api/users/me → UserResponse (no ApiResponse wrapper for this endpoint)
      const res = await apiRequest.getMe();
      // UserController returns UserResponse directly (not ApiResponse)
      const userData = res.data as unknown as UserDTO;
      setBeUser(userData);
      setFullName(userData.fullName ?? "");
      setTravelStyle((userData.travelStyle as typeof TRAVEL_STYLES[number]) ?? "SOLO");
      setGender((userData.gender as typeof GENDERS[number]) ?? "OTHER");
    } catch {
      // Fallback to Clerk data — backend may not have the user yet
    } finally {
      setIsLoadingBe(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      // PUT /api/users/updateProfile
      await apiRequest.updateProfile({ fullName: fullName.trim(), travelStyle, gender });
      await loadBeProfile();
      setIsEditing(false);
      Alert.alert("Saved ✅", "Profile updated successfully");
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

  // Display info — prefer BE data, fallback to Clerk
  const displayName  = beUser?.fullName  ?? user?.fullName  ?? "Traveler";
  const displayEmail = beUser?.email     ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const displayAvatar = beUser?.avatarUrl ?? user?.imageUrl;

  return {
    // Display
    displayName, displayEmail, displayAvatar,
    beUser,

    // Edit state
    isEditing, setIsEditing,
    isSaving, isLoadingBe,

    // Editable fields
    fullName, setFullName,
    travelStyle, setTravelStyle,
    gender, setGender,

    // Constants
    travelStyles: TRAVEL_STYLES,
    genders:      GENDERS,

    // Actions
    handleSave,
    handleSignOut,
    navigateToItineraries: () => navigation.navigate("Itinerary"),
    navigateToBookmarks:   () => navigation.navigate("Explore"),
  };
}
