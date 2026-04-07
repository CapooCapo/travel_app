import { useState } from "react";
import { Alert } from "react-native";
import { eventService } from "../../../services/event.service";

export function useCreateEvent(navigation: any) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("0");
  const [isFree, setIsFree] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    title.trim().length > 0 &&
    address.trim().length > 0 &&
    startDate.length > 0 &&
    endDate.length > 0;

  const handleCreate = async () => {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    try {
      await eventService.createEvent({
        title: title.trim(),
        category: category.trim() || "general",
        description: description.trim(),
        address: address.trim(),
        latitude: 0,
        longitude: 0,
        startDate,
        endDate,
        price: isFree ? 0 : parseFloat(price) || 0,
        isFree,
      });
      Alert.alert("Submitted!", "Your event is pending admin approval.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title, setTitle, category, setCategory,
    description, setDescription, address, setAddress,
    startDate, setStartDate, endDate, setEndDate,
    price, setPrice, isFree, setIsFree,
    isLoading, canSubmit, handleCreate,
    goBack: () => navigation.goBack(),
  };
}
