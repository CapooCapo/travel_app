import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { eventService } from "../../../services/event.service";
import { discoveryService } from "../../../services/discovery.service";
import { EventCreateRequest, EventResponse } from "../../../dto/event/event.DTO";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export function useCreateEvent(navigation: any, route: any) {
  const existingEvent: EventResponse | undefined = route.params?.event;
  const isEditMode = !!existingEvent;

  const [title, setTitle] = useState(existingEvent?.title || "");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [description, setDescription] = useState(existingEvent?.description || "");
  
  // -- Location Autocomplete State --
  const [locationKeyword, setLocationKeyword] = useState(existingEvent?.address || "");
  const [suggestions, setSuggestions] = useState<PlaceDTO[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<PlaceDTO | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // -- Date State (using Date objects) --
  const [startTime, setStartTime] = useState<Date>(existingEvent?.startTime ? new Date(existingEvent.startTime) : new Date());
  const [endTime, setEndTime] = useState<Date>(existingEvent?.endTime ? new Date(existingEvent.endTime) : new Date(Date.now() + 3600000));

  const [price, setPrice] = useState(existingEvent?.price?.toString() || "0");
  const [isFree, setIsFree] = useState(existingEvent ? (existingEvent.price === null || existingEvent.price <= 0) : true);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(existingEvent?.images || []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await eventService.getCategories();
      setCategories(data);
      if (isEditMode && existingEvent) {
          const match = data.find(c => c.name.toLowerCase() === existingEvent.category.toLowerCase());
          if (match) setCategoryId(match.id);
      } else if (data.length > 0) {
          setCategoryId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  // -- Autocomplete Logic --
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (locationKeyword.length > 2 && !selectedLocation) {
        performSearch(locationKeyword);
      } else if (locationKeyword.length === 0) {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [locationKeyword, selectedLocation]);

  const performSearch = async (kw: string) => {
    setIsSearching(true);
    try {
      const results = await discoveryService.searchLocations(kw);
      setSuggestions(results);
    } catch (e) {
      console.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: PlaceDTO) => {
    setSelectedLocation(loc);
    setLocationKeyword(loc.name);
    setSuggestions([]);
  };

  const openStartPicker = () => {
    if (Platform.OS === 'android') {
      console.log("Opening Start DateTimePicker on Android");
      DateTimePickerAndroid.open({
        value: startTime,
        // @ts-ignore - AndroidMode type formally excludes 'datetime' but user specifically requested it
        mode: "datetime",
        is24Hour: true,
        onChange: (event: any, selectedDate?: Date) => {
          console.log("onChange start trigger:", event.type);
          if (event.type === 'set' && selectedDate) {
            setStartTime(selectedDate);
          }
        },
      });
    } else {
      // iOS fallback if ever used again
      console.log("iOS picker not updated in this fix");
    }
  };

  const openEndPicker = () => {
    if (Platform.OS === 'android') {
      console.log("Opening End DateTimePicker on Android");
      DateTimePickerAndroid.open({
        value: endTime,
        // @ts-ignore - AndroidMode type formally excludes 'datetime' but user specifically requested it
        mode: "datetime",
        is24Hour: true,
        onChange: (event: any, selectedDate?: Date) => {
          console.log("onChange end trigger:", event.type);
          if (event.type === 'set' && selectedDate) {
            setEndTime(selectedDate);
          }
        },
      });
    } else {
      console.log("iOS picker not updated in this fix");
    }
  };

  const canSubmit =
    title.trim().length > 0 &&
    categoryId !== null &&
    locationKeyword.trim().length > 0 &&
    startTime < endTime;

  const handleSubmit = async () => {
    if (!canSubmit || isLoading) {
      if (startTime >= endTime) {
        Alert.alert("Error", "End time must be after start time");
      }
      return;
    }

    setIsLoading(true);
    try {
      const payload: EventCreateRequest = {
        title: title.trim(),
        categoryId: categoryId as number,
        description: description.trim(),
        address: locationKeyword.trim(),
        locationId: selectedLocation?.id || existingEvent?.locationId,
        latitude: selectedLocation?.latitude || 0,
        longitude: selectedLocation?.longitude || 0,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: isFree ? 0 : parseFloat(price) || 0,
        images: images.length > 0 ? images : undefined,
      };

      if (isEditMode && existingEvent) {
        await eventService.updateEvent(existingEvent.id, payload);
        Alert.alert("Success!", "Event updated.", [{ text: "OK", onPress: () => navigation.goBack() }]);
      } else {
        await eventService.createEvent(payload);
        Alert.alert("Success!", "Event created.", [{ text: "OK", onPress: () => navigation.goBack() }]);
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title, setTitle, categoryId, setCategoryId, categories,
    description, setDescription, 
    locationKeyword, setLocationKeyword, suggestions, isSearching, handleSelectLocation, setSelectedLocation,
    startTime, setStartTime, endTime, setEndTime, 
    openStartPicker, openEndPicker,
    price, setPrice, isFree, setIsFree,
    isLoading, canSubmit, handleSubmit, isEditMode,
    goBack: () => navigation.goBack(),
  };
}
