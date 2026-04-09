import { useState, useEffect } from "react";
import { Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "../../../api/client";
import { useAuth } from "../../../hooks/useAuth";
import { UserDTO} from "../../../dto/auth/user.DTO";
import { Res } from "../../../dto/format";

const TRAVEL_STYLES = ["SOLO", "FAMILY", "GROUP"] as const;
const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;

// Dữ liệu mẫu (Master Data) các sở thích có trên Backend
// ID phải khớp với ID trong database (bảng interests) của bạn
export const MASTER_INTERESTS = [
  { id: 1, name: "Beaches" },
  { id: 2, name: "Hiking" },
  { id: 3, name: "Culture" },
  { id: 4, name: "Food & Culinary" },
  { id: 5, name: "Relaxation" },
  { id: 6, name: "Photography" },
];

export function useProfile(navigation: any) {
  const { signOut, user } = useAuth();

  const [beUser, setBeUser] = useState<UserDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBe, setIsLoadingBe] = useState(true);

  // Editable fields (synced from beUser)
  const [fullName, setFullName] = useState("");
  const [travelStyle, setTravelStyle] = useState<(typeof TRAVEL_STYLES)[number]>("SOLO");
  const [gender, setGender] = useState<(typeof GENDERS)[number]>("OTHER");

  // State quản lý danh sách ID sở thích đang chọn
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);

  // Load BE user profile on mount
  useEffect(() => {
    loadBeProfile();
  }, []);

  const loadBeProfile = async () => {
    setIsLoadingBe(true);
    try {
      const userData = await apiRequest.getMe();
      if (!userData) {
        console.warn("[useProfile] No user data returned from backend.");
        return;
      }

      setBeUser(userData);
      console.log("[useProfile] Backend user data loaded:", { 
          id: userData.id, 
          verified: userData.verified 
      });
      setFullName(userData.fullName || user?.fullName || "");
      setTravelStyle((userData.travelStyle as typeof TRAVEL_STYLES[number]) ?? "SOLO");
      setGender((userData.gender as typeof GENDERS[number]) ?? "OTHER");

      // Safely process interests
      if (userData.interests && Array.isArray(userData.interests)) {
        const ids = userData.interests
          .map((i) => i?.id != null ? Number(i.id) : null)
          .filter((id): id is number => id !== null);
        setSelectedInterestIds(ids);
      }
    } catch (e: any) {
      console.error("loadBeProfile error:", e?.message);
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
      // 1. Cập nhật thông tin cơ bản
      await apiRequest.updateProfile({
        fullName: fullName.trim(),
        travelStyle,
        gender,
      });

      // 2. Cập nhật sở thích (Gửi mảng ID xuống BE)
      await apiRequest.updateInterests(selectedInterestIds);

      // 3. Tải lại dữ liệu
      await loadBeProfile();
      setIsEditing(false);
      Alert.alert("Success ✅", "Profile updated successfully");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not update profile");
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
            await signOut();
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Sign out failed");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete My Account",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSaving(true);
              await apiRequest.deleteAccount();
              await signOut();
            } catch (e: any) {
              Alert.alert("Error", e?.message || "Account deletion failed");
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      setIsSaving(true);
      
      // 1. Get signed link from BE
      const relativeUrl = await apiRequest.getExportDataLink();
      
      // 2. Build full download URL
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.72:8080";
      const downloadUrl = `${baseUrl}${relativeUrl}`;

      console.log("[useProfile] Opening download link:", downloadUrl);

      // 3. Open in browser
      await Linking.openURL(downloadUrl);
      
      Alert.alert(
        "Export Started",
        "Your data export has been triggered in the browser. Please check your downloads folder."
      );
    } catch (e: any) {
      console.error("[useProfile] Export error:", e);
      Alert.alert("Export Error", e?.message || "Failed to start data export");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = beUser?.fullName ?? user?.fullName ?? "Traveler";
  const displayEmail = beUser?.email ?? user?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const displayAvatar = beUser?.avatarUrl ?? user?.avatarUrl ?? user?.imageUrl;

  return {
    displayName,
    displayEmail,
    displayAvatar,
    beUser,
    isEditing,
    setIsEditing,
    isSaving,
    isLoadingBe,
    fullName,
    setFullName,
    travelStyle,
    setTravelStyle,
    gender,
    setGender,
    selectedInterestIds,
    setSelectedInterestIds,
    travelStyles: TRAVEL_STYLES,
    genders: GENDERS,
    masterInterests: MASTER_INTERESTS, // Export để render UI
    handleSave,
    handleSignOut,
    handleDeleteAccount,
    handleExportData,
    loadBeProfile,
    navigateToAdmin: () => navigation.navigate("AdminDashboard"),
    navigateToItineraries: () => navigation.navigate("Itinerary"),
    navigateToBookmarks:   () => navigation.navigate("MainTabs", { 
      screen: "Explore",
      params: { bookmarks: true }
    }),
  };
}
