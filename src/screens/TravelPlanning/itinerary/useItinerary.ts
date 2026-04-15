import { useState, useEffect } from "react";
import { Alert, Share } from "react-native";
import { itineraryService } from "../../../services/itinerary.service";
import { ItineraryDTO } from "../../../dto/travel/travel.DTO";

export function useItinerary(navigation: any) {
  const [itineraries, setItineraries] = useState<ItineraryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await itineraryService.getItineraries();
      setItineraries(data);
    } catch (e) {
      console.error("fetchItineraries error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItinerary = (id: number) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await itineraryService.deleteItinerary(id);
            setItineraries((prev) => prev.filter((it) => it.id !== id));
          } catch (e) {
            Alert.alert("Error", "Failed to delete");
          }
        },
      },
    ]);
  };

  const shareItinerary = async (id: number) => {
    try {
      const shareUrl = await itineraryService.shareItinerary(id);
      if (shareUrl) {
        await Share.share({ message: `Check out my trip: ${shareUrl}` });
      }
    } catch (e) {
      Alert.alert("Error", "Failed to share");
    }
  };

  return {
    itineraries,
    isLoading,
    fetchData,
    deleteItinerary,
    shareItinerary,
    goBack: () => navigation.goBack(),
    goToCreate: () => navigation.navigate("CreatePlan"),
    goToDetail: (id: number) => navigation.navigate("ItineraryDetail", { id }),
  };
}
