import { useState } from "react";
import { Alert } from "react-native";
import { travelService } from "../../../services/travel.service";

export function CreatePlanFunction(navigation: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    title.trim().length > 0 && startDate.length > 0 && endDate.length > 0;

  const handleCreate = async () => {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    try {
      await travelService.createItinerary({
        title: title.trim(),
        description: description.trim() || undefined,
        startDate,
        endDate,
      });
      Alert.alert("Created!", "Your itinerary has been created.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to create itinerary");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title, setTitle, description, setDescription,
    startDate, setStartDate, endDate, setEndDate,
    isLoading, canSubmit, handleCreate,
    goBack: () => navigation.goBack(),
  };
}
