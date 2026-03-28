import React from "react";
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Linking, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./PlaceDetail.Style";
import { PlaceDetailFunction } from "./PlaceDetail.Function";
import { COLORS } from "../../../constants/theme";
import { ReviewDTO } from "../../../dto/review/review.DTO";
import { EventDTO } from "../../../dto/event/event.DTO";

const TABS = ["info", "reviews", "events"] as const;

const PlaceDetailScreen = ({ navigation, route }: any) => {
  const { placeId } = route.params;
  const insets = useSafeAreaInsets();
  const {
    place, reviews, events, isLoading,
    isBookmarked, activeTab, setActiveTab,
    handleToggleBookmark, handleShare,
    navigateToWriteReview, navigateToEventDetail, goBack,
  } = PlaceDetailFunction(navigation, placeId);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (!place) return null;

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const renderStars = (rating: number) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? "star" : "star-outline"}
          size={14}
          color={COLORS.primary}
        />
      ))}
    </View>
  );

  const renderReview = (item: ReviewDTO) => (
    <View key={item.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.userName}</Text>
        <Text style={styles.reviewDate}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
        </Text>
      </View>
      {renderStars(item.rating)}
      {/* BE trả "comment" (mapped từ content) */}
      <Text style={styles.reviewText}>{item.comment}</Text>
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: "100%", height: 120, borderRadius: 8, marginTop: 8 }}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );

  const renderEvent = (item: EventDTO) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigateToEventDetail(item)}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
      activeOpacity={0.8}
    >
      <View style={{
        width: 44, height: 44, borderRadius: 10,
        backgroundColor: COLORS.primary + "22",
        alignItems: "center", justifyContent: "center",
      }}>
        <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: COLORS.text, fontWeight: "700", marginBottom: 2 }}
          numberOfLines={1}>{item.title}</Text>
        <Text style={{ color: COLORS.muted, fontSize: 12 }}>
          {new Date(item.startDate).toLocaleDateString()} ·{" "}
          <Text style={{
            color: item.status === "incoming" ? COLORS.primary :
              item.status === "ongoing" ? "#00c864" : COLORS.muted,
            fontWeight: "600", textTransform: "capitalize",
          }}>{item.status}</Text>
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View>
          <Image
            source={{ uri: place.imageUrls?.[0] ?? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800" }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={[styles.heroActions, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={goBack}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.heroActionsRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleToggleBookmark}>
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? COLORS.primary : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.name}>{place.name}</Text>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.muted} />
            <Text style={styles.addressText}>{place.address}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={COLORS.primary} />
            <Text style={styles.ratingText}>
              {place.rating > 0 ? place.rating.toFixed(1) : "New"}
            </Text>
            {reviews.length > 0 && (
              <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "events" && events.length > 0 ? ` (${events.length})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info tab */}
          {activeTab === "info" && (
            <>
              <Text style={styles.description}>{place.description}</Text>
              <TouchableOpacity style={styles.directionsBtn} onPress={openDirections}>
                <Ionicons name="navigate-outline" size={18} color={COLORS.text} />
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <>
              {reviews.length === 0 ? (
                <Text style={{ color: COLORS.muted, textAlign: "center", marginVertical: 20 }}>
                  No reviews yet. Be the first!
                </Text>
              ) : (
                reviews.map(renderReview)
              )}
              <TouchableOpacity style={styles.addReviewBtn} onPress={navigateToWriteReview}>
                <Ionicons name="create-outline" size={18} color="#fff" />
                <Text style={styles.addReviewText}>Write a Review</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Events tab */}
          {activeTab === "events" && (
            <>
              {events.length === 0 ? (
                <Text style={{ color: COLORS.muted, textAlign: "center", marginVertical: 20 }}>
                  No upcoming events at this location.
                </Text>
              ) : (
                events.map(renderEvent)
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlaceDetailScreen;
