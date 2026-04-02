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
import { EventDTO } from "../../../dto/event/event.DTO";
import { LinearGradient } from 'expo-linear-gradient';
import { AiRecommendationDTO } from "../../../dto/ai/ai.DTO";

// ─── Curated Unsplash photo pools per travel category ────────────────────────
// Each category has multiple photos so cards look different from each other.
const PHOTO_POOLS: Record<string, string[]> = {
    food: [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
    ],
    restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500",
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=500",
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=500",
    ],
    nature: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=500",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500",
    ],
    beach: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=500",
    ],
    culture: [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=500",
        "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=500",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=500",
    ],
    museum: [
        "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=500",
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=500",
        "https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=500",
    ],
    shopping: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=500",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=500",
    ],
    adventure: [
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=500",
        "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=500",
        "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=500",
    ],
    park: [
        "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=500",
        "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=500",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=500",
    ],
    default: [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=500",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=500",
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=500",
    ],
};

/** Pick a consistent (non-random) photo based on attraction name + category */
function getAttractionImage(name: string, category?: string): string {
    const key = category?.toLowerCase() ?? "";
    const pool =
        PHOTO_POOLS[key] ??
        Object.entries(PHOTO_POOLS).find(([k]) => key.includes(k))?.[1] ??
        PHOTO_POOLS.default;
    // Use attraction name to pick deterministically — same place always gets same photo
    const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
    return pool[index];
}

// ─── Screen component ─────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const {
        featuredPlaces,
        upcomingEvents,
        isLoading,
        navigateToExplore,
        loadingStep,
        navigateToEventList,
        navigateToPlaceDetail,
        navigateToEventDetail,
        loadHomeData,
    } = HomeFunction(navigation);

    const renderPlaceCard = ({ item }: { item: AiRecommendationDTO }) => (
        <TouchableOpacity
            style={styles.placeCard}
            onPress={() => navigateToPlaceDetail(item.attraction.id)}
            activeOpacity={0.8}
        >
            <Image
                source={{
                    // Ignore backend imageUrls — they may be wrong/unrelated.
                    // Use attraction name + category to get a relevant photo from Unsplash.
                    uri: getAttractionImage(
                        item.attraction.name,
                        (item.attraction as any).category,
                    ),
                }}
                style={styles.placeImage}
                resizeMode="cover"
            />

            <LinearGradient
                colors={[COLORS.primary + '33', COLORS.primary + '10']}
                style={{ padding: 8, marginHorizontal: 8, marginTop: 8, borderRadius: 8 }}
            >
                <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '700' }}>
                    ✨ AI Gợi ý: {item.aiReason}
                </Text>
            </LinearGradient>

            <View style={styles.placeInfo}>
                <Text style={styles.placeName} numberOfLines={1}>{item.attraction.name}</Text>
                <Text style={styles.placeCategory}>{(item.attraction as any).category ?? "Attraction"}</Text>
                <View style={styles.placeRatingRow}>
                    <Ionicons name="star" size={12} color={COLORS.primary} />
                    <Text style={styles.placeRating}>
                        {item.attraction.ratingAverage ? item.attraction.ratingAverage.toFixed(1) : "0.0"}
                    </Text>
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
            <View style={[styles.container, styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{
                    marginTop: 16,
                    color: COLORS.muted,
                    fontSize: 14,
                    fontWeight: "500",
                    paddingHorizontal: 32,
                    textAlign: "center"
                }}>
                    {loadingStep}
                </Text>
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
                    // Sửa từ item.id thành item.attraction.id
                    keyExtractor={(item) => `place-${item.attraction.id}`}
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
                        { icon: "map-outline", label: "Itineraries", route: "Itinerary" },
                        { icon: "shield-outline", label: "Admin", route: "AdminDashboard" },
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
