import { useState } from "react";
import { Alert } from "react-native";
import { travelService } from "../../../services/travel.service";
import { COLORS } from "../../../constants/theme";

export function CreatePlanFunction(navigation: any, route: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // For calendar range selection
  const [markedDates, setMarkedDates] = useState<any>({});

  const autoAddPlace = route.params?.autoAddPlace;

  const onDayPress = (day: any) => {
    const dateStr = day.dateString;
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate("");
      setMarkedDates({
        [dateStr]: { startingDay: true, color: COLORS.primary, textColor: "white" }
      });
    } else {
      // Set end date and fill range
      let start = new Date(startDate);
      let end = new Date(dateStr);
      if (end < start) {
        // Swap if end is before start
        const temp = startDate;
        setStartDate(dateStr);
        setEndDate(temp);
      } else {
        setEndDate(dateStr);
      }

      // Generate markings for the range (very basic example, should iterate through days)
      const range = getDatesBetween(startDate < dateStr ? startDate : dateStr, startDate < dateStr ? dateStr : startDate);
      const newMarked: any = {};
      range.forEach((d, idx) => {
        newMarked[d] = {
          color: COLORS.primary,
          textColor: "white",
          startingDay: idx === 0,
          endingDay: idx === range.length - 1
        };
      });
      setMarkedDates(newMarked);
    }
  };

  const getDatesBetween = (start: string, end: string) => {
    const dates = [];
    let curr = new Date(start);
    const stop = new Date(end);
    while (curr <= stop) {
      dates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const canSubmit =
    title.trim().length > 0 && startDate.length > 0 && endDate.length > 0;

  const handleCreate = async () => {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    try {
      const newItin = await travelService.createItinerary({
        title: title.trim(),
        description: description.trim() || undefined,
        startDate,
        endDate,
      });

      // AUTOMATE ADDITION IF REQUESTED
      if (autoAddPlace && newItin.id) {
        await travelService.addItineraryItem(newItin.id, {
          itineraryId: newItin.id,
          date: startDate,
          type: autoAddPlace.type === "place" ? "PLACE" : "EVENT",
          referenceId: autoAddPlace.id,
          note: "Automatically added"
        });
        Alert.alert("Success!", `${autoAddPlace.name} added to your new trip.`);
      } else {
        Alert.alert("Created!", "Your itinerary has been created.");
      }

      navigation.goBack();
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
    onDayPress, markedDates,
    goBack: () => navigation.goBack(),
  };
}
