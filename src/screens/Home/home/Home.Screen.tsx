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
import { getPlaceImage } from "../../utils/imageUtils";
import { PlaceCard } from "../../../components/Discovery/PlaceCard";


// Local PHOTO_POOLS and getAttractionImage have been moved to src/utils/imageUtils.ts


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
        <PlaceCard
            id={item.attraction.id}
            name={item.attraction.name}
            category={(item.attraction as any).category ?? "Attraction"}
            rating={item.attraction.ratingAverage}
            aiReason={item.aiReason}
            onPress={() => navigateToPlaceDetail(item.attraction.id)}
            variant="horizontal"
        />
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
                            <View style={styles.iconWrapper}>
                                <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.avatarBtn}
                            onPress={() => navigation.navigate("Profile")}
                        >
                            <View style={styles.iconWrapper}>
                                <Ionicons name="person-outline" size={22} color={COLORS.text} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Search Bar ── */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={navigateToExplore}
                    activeOpacity={0.7}
                >
                    <View style={styles.searchIconWrapper}>
                        <Ionicons name="search-outline" size={20} color={COLORS.muted} />
                    </View>
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
                            <View style={styles.quickActionIconWrapper}>
                                <Ionicons name={icon as any} size={24} color={COLORS.primary} />
                            </View>
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
