import { useState, useEffect } from "react";
import { Alert, Share } from "react-native";
import { discoveryService } from "../../../services/discovery.service";
import { reviewService } from "../../../services/review.service";
import { eventService } from "../../../services/event.service";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { ReviewDTO } from "../../../dto/review/review.DTO";
import { EventDTO } from "../../../dto/event/event.DTO";

export function PlaceDetailFunction(navigation: any, placeId: number) {
  const [place,         setPlace]         = useState<PlaceDTO | null>(null);
  const [reviews,       setReviews]       = useState<ReviewDTO[]>([]);
  const [events,        setEvents]        = useState<EventDTO[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isBookmarked,  setIsBookmarked]  = useState(false);
  const [activeTab,     setActiveTab]     = useState<"info" | "reviews" | "events">("info");

  useEffect(() => {
    loadPlaceDetail();
  }, [placeId]);

  const loadPlaceDetail = async () => {
    setIsLoading(true);
    try {
      // getAttractionById tự gọi kèm images
      const [placeRes, reviewRes, eventRes] = await Promise.allSettled([
        discoveryService.getAttractionById(placeId),
        reviewService.getReviews(placeId, 0, 5),
        eventService.getEventsByAttraction(placeId, 0, 5),
      ]);

      if (placeRes.status === "fulfilled" && placeRes.value) {
        setPlace(placeRes.value);
        setIsBookmarked(placeRes.value.isBookmarked ?? false);
      }
      if (reviewRes.status === "fulfilled") {
        setReviews(reviewRes.value?.reviews ?? []);
      }
      if (eventRes.status === "fulfilled") {
        setEvents(eventRes.value?.events ?? []);
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
      // toggleBookmark(attractionId, currentlyBookmarked) → returns new state
      const newState = await discoveryService.toggleBookmark(place.id, isBookmarked);
      setIsBookmarked(newState);
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

  // Route params: attractionId (placeId) và targetType = "place"
  const navigateToWriteReview = () =>
    navigation.navigate("WriteReview", { attractionId: placeId });

  // Navigate to event detail — pass entire event object (BE không có GET /events/{id})
  const navigateToEventDetail = (event: EventDTO) =>
    navigation.navigate("EventDetail", { event });

  const goBack = () => navigation.goBack();

  return {
    place,
    reviews,
    events,
    isLoading,
    isBookmarked,
    activeTab,
    setActiveTab,
    handleToggleBookmark,
    handleShare,
    navigateToWriteReview,
    navigateToEventDetail,
    goBack,
    loadPlaceDetail,
  };
}
