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

const PlaceDetailScreen = ({ navigation, route }: any) => {
  const { placeId } = route.params;
  const insets = useSafeAreaInsets();
  const {
    place, reviews, isLoading, isBookmarked, activeTab, setActiveTab,
    handleToggleBookmark, handleShare, navigateToWriteReview, goBack,
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
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {renderStars(item.rating)}
      <Text style={styles.reviewText}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View>
          <Image
            source={{ uri: place.imageUrls?.[0] ?? "https://via.placeholder.com/400x260" }}
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
            <Text style={styles.ratingText}>{place.rating?.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({place.reviewCount} reviews)</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{place.category}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{place.priceRange}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {["info", "reviews"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab as "info" | "reviews")}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === "info" ? (
            <>
              <Text style={styles.description}>{place.description}</Text>

              {place.openingHours && (
                <>
                  <Text style={styles.sectionLabel}>Opening Hours</Text>
                  <Text style={styles.hoursText}>{place.openingHours}</Text>
                </>
              )}

              <TouchableOpacity style={styles.directionsBtn} onPress={openDirections}>
                <Ionicons name="navigate-outline" size={18} color={COLORS.text} />
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </>
          ) : (
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
        </View>
      </ScrollView>
    </View>
  );
};

export default PlaceDetailScreen;
