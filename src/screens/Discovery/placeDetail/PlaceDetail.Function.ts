import { useState, useEffect } from "react";
import { Alert, Share } from "react-native";
import { discoveryService } from "../../../services/discovery.service";
import { reviewService } from "../../../services/review.service";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { ReviewDTO } from "../../../dto/review/review.DTO";

export function PlaceDetailFunction(navigation: any, placeId: number) {
  const [place, setPlace] = useState<PlaceDTO | null>(null);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");

  useEffect(() => {
    loadPlaceDetail();
  }, [placeId]);

  const loadPlaceDetail = async () => {
    setIsLoading(true);
    try {
      const [placeRes, reviewRes] = await Promise.allSettled([
        discoveryService.getPlaceById(placeId),
        reviewService.getReviews({ targetId: placeId, targetType: "place", limit: 5 }),
      ]);
      if (placeRes.status === "fulfilled" && placeRes.value) {
        setPlace(placeRes.value);
        setIsBookmarked(placeRes.value.isBookmarked ?? false);
      }
      if (reviewRes.status === "fulfilled") {
        setReviews(reviewRes.value?.reviews ?? []);
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load place");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!place) return;
    try {
      await discoveryService.toggleBookmark({ placeId: place.id, isBookmarked: !isBookmarked });
      setIsBookmarked(!isBookmarked);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update bookmark");
    }
  };

  const handleShare = async () => {
    if (!place) return;
    await Share.share({
      title: place.name,
      message: `Check out ${place.name} on ExploreEase!\n${place.address}`,
    });
  };

  const navigateToWriteReview = () =>
    navigation.navigate("WriteReview", { targetId: placeId, targetType: "place" });

  const goBack = () => navigation.goBack();

  return {
    place,
    reviews,
    isLoading,
    isBookmarked,
    activeTab,
    setActiveTab,
    handleToggleBookmark,
    handleShare,
    navigateToWriteReview,
    goBack,
  };
}
