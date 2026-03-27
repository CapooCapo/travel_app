import { useState, useEffect } from "react";
import { Alert, Share } from "react-native";
import { travelService } from "../../../services/travel.service";
import { ItineraryDTO } from "../../../dto/travel/travel.DTO";

export function ItineraryFunction(navigation: any) {
  const [itineraries, setItineraries] = useState<ItineraryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    setIsLoading(true);
    try {
      const res = await travelService.getItineraries();
      setItineraries(res ?? []);
    } catch {
      // Silent fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (id: number) => {
    try {
      const url = await travelService.shareItinerary(id);
      await Share.share({ message: `Check out my travel plan on ExploreEase!\n${url}` });
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to share");
    }
  };

  const navigateToDetail = (id: number) =>
    navigation.navigate("ItineraryDetail", { itineraryId: id });

  const navigateToCreate = () => navigation.navigate("CreatePlan");

  return {
    itineraries, isLoading,
    handleShare, navigateToDetail, navigateToCreate, loadItineraries,
  };
}
