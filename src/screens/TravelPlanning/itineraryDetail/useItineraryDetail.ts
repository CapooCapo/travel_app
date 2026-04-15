import { useState, useEffect } from "react";
import { Alert, Share } from "react-native";
import { travelService } from "../../../services/travel.service";
import { ItineraryDTO, DayPlanDTO, DayPlanItemDTO } from "../../../dto/travel/travel.DTO";

export function useItineraryDetail(navigation: any, itineraryId: number) {
  const [itinerary, setItinerary] = useState<ItineraryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItinerary();
  }, [itineraryId]);

  const loadItinerary = async () => {
    setIsLoading(true);
    try {
      const res = await travelService.getItineraryById(itineraryId);
      if (res) {
        // Sort items by order inside each day
        const sortedDays = res.days.map(day => ({
          ...day,
          items: [...day.items].sort((a, b) => a.order - b.order)
        }));
        setItinerary({ ...res, days: sortedDays });
      }
    } catch {
      Alert.alert("Error", "Could not load itinerary details");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive", onPress: async () => {
          try {
            await travelService.deleteItineraryItem(itineraryId, itemId);
            // Delete locally
            if (itinerary) {
              const newDays = itinerary.days.map(d => ({
                ...d,
                items: d.items.filter(i => i.id !== itemId)
              }));
              setItinerary({ ...itinerary, days: newDays });
            }
          } catch {
            Alert.alert("Error", "Could not remove item");
          }
        }
      }
    ]);
  };

  const deleteItinerary = async () => {
    Alert.alert("Delete Itinerary", "Are you sure you want to delete this full itinerary?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await travelService.deleteItinerary(itineraryId);
            navigation.goBack();
          } catch {
            Alert.alert("Error", "Could not delete itinerary");
          }
        }
      }
    ]);
  };

  const handleShare = async () => {
    if (!itinerary) return;
    try {
      const shareUrl = await travelService.shareItinerary(itineraryId);
      await Share.share({
        message: `Check out my itinerary: ${itinerary.title}\n${shareUrl}`,
        url: shareUrl, // iOS only
        title: itinerary.title
      });
    } catch (error) {
      console.error("[useItineraryDetail] Share Error:", error);
      Alert.alert("Error", "Could not share itinerary");
    }
  };

  const moveItem = (dayIndex: number, itemIndex: number, direction: "up" | "down") => {
    if (!itinerary) return;
    
    const newDays = [...itinerary.days];
    const items = [...newDays[dayIndex].items];

    if (direction === "up" && itemIndex > 0) {
      // Swipe with previous
      const temp = items[itemIndex - 1];
      items[itemIndex - 1] = items[itemIndex];
      items[itemIndex] = temp;
    } else if (direction === "down" && itemIndex < items.length - 1) {
      // Swipe with next
      const temp = items[itemIndex + 1];
      items[itemIndex + 1] = items[itemIndex];
      items[itemIndex] = temp;
    } else {
      return; 
    }

    // Update 'order' property locally
    items.forEach((it, idx) => it.order = idx);
    newDays[dayIndex].items = items;
    setItinerary({ ...itinerary, days: newDays });
    
    // Note: If BE supported reordering, we'd fire an API call here.
  };

  const goBack = () => navigation.goBack();
  
  const handleAddNewStop = () => {
    // Usually routes to explore or search
    navigation.navigate("MainTabs", { screen: "Explore" });
  };

  return {
    itinerary,
    isLoading,
    loadItinerary,
    removeItem,
    deleteItinerary,
    handleShare,
    moveItem,
    goBack,
    handleAddNewStop
  };
}
