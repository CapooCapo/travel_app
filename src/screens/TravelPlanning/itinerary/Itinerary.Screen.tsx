import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Itinerary.Style";
import { useItinerary } from "./useItinerary";
import { COLORS } from "../../../constants/theme";
import { ItineraryDTO } from "../../../dto/travel/travel.DTO";

const ItineraryScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    itineraries, isLoading,
    handleShare, navigateToDetail, navigateToCreate, loadItineraries,
    deleteItinerary,
  } = useItinerary(navigation);

  useFocusEffect(
    useCallback(() => {
      loadItineraries();
    }, [])
  );

  const renderCard = ({ item }: { item: ItineraryDTO }) => {
    const totalItems = (item.days || []).reduce((sum, d) => sum + d.items.length, 0);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigateToDetail(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(item.id)}>
              <Ionicons name="share-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.shareBtn, { marginLeft: 10 }]} 
              onPress={() => deleteItinerary(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardDates}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
          <Text style={styles.cardDatesText}>
            {new Date(item.startDate).toLocaleDateString()} — {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
        {item.description ? (
          <Text style={{ ...styles.cardDatesText, marginBottom: 4 }} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Ionicons name="sunny-outline" size={13} color={COLORS.muted} />
            <Text style={styles.statText}>{(item.days || []).length} days</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={13} color={COLORS.muted} />
            <Text style={styles.statText}>{totalItems} stops</Text>
          </View>
          {item.isShared && (
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={13} color={COLORS.primary} />
              <Text style={[styles.statText, { color: COLORS.primary }]}>Shared</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Itineraries</Text>
        <TouchableOpacity style={styles.addBtn} onPress={navigateToCreate}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />
      ) : (
        <FlatList
          data={itineraries}
          renderItem={renderCard}
          keyExtractor={(item) => `itin-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadItineraries} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={52} color={COLORS.muted} />
              <Text style={styles.emptyText}>No itineraries yet</Text>
              <Text style={styles.emptySubText}>Tap + to plan your first trip</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ItineraryScreen;
