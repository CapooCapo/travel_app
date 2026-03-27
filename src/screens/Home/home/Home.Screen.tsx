import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Home.Style";
import { HomeFunction } from "./Home.Function";
import { COLORS } from "../../../constants/theme";
import { PlaceDTO } from "../../../dto/discovery/place.DTO";
import { EventDTO } from "../../../dto/event/event.DTO";

const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    featuredPlaces,
    upcomingEvents,
    isLoading,
    navigateToExplore,
    navigateToEventList,
    navigateToPlaceDetail,
    navigateToEventDetail,
    loadHomeData,
  } = HomeFunction(navigation);

  const renderPlaceCard = ({ item }: { item: PlaceDTO }) => (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={() => navigateToPlaceDetail(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrls?.[0] ?? "https://via.placeholder.com/300x140" }}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.placeCategory}>{item.category}</Text>
        <View style={styles.placeRatingRow}>
          <Ionicons name="star" size={12} color={COLORS.primary} />
          <Text style={styles.placeRating}>{item.rating?.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }: { item: EventDTO }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigateToEventDetail(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl ?? "https://via.placeholder.com/80" }}
        style={styles.eventImage}
        resizeMode="cover"
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.eventMeta}>{item.address}</Text>
        <View style={styles.eventBadge}>
          <Text style={styles.eventBadgeText}>
            {item.isFree ? "FREE" : `$${item.price}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && featuredPlaces.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadHomeData}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day, traveler!</Text>
            <Text style={styles.headerTitle}>Explore World</Text>
          </View>

          {/* Notification + Profile buttons */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate("Notification")}
            >
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search Bar ── */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={navigateToExplore}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={18} color={COLORS.muted} />
          <Text style={styles.searchText}>
            Search places, cuisines, activities…
          </Text>
        </TouchableOpacity>

        {/* ── Featured Places ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated</Text>
          <TouchableOpacity onPress={navigateToExplore}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredPlaces}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => `place-${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No places available</Text>
          }
        />

        {/* ── Upcoming Events ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={navigateToEventList}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={upcomingEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => `event-${item.id}`}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events yet</Text>
          }
        />

        {/* ── Quick Links ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Travel</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 8 }}>
          {[
            { icon: "map-outline",      label: "Itineraries", route: "Itinerary"      },
            { icon: "shield-outline",   label: "Admin",        route: "AdminDashboard" },
          ].map(({ icon, label, route }) => (
            <TouchableOpacity
              key={route}
              onPress={() => navigation.navigate(route)}
              style={{
                flex: 1,
                backgroundColor: COLORS.card,
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
                gap: 6,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Ionicons name={icon as any} size={22} color={COLORS.primary} />
              <Text style={{ color: COLORS.text, fontSize: 12, fontWeight: "600" }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
