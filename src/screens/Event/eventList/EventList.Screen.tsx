import React, { useEffect } from "react";
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, Image, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./EventList.Style";
import { EventListFunction } from "./EventList.Function";
import { COLORS } from "../../../constants/theme";
import { EventDTO } from "../../../dto/event/event.DTO";

const EventListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    events, isLoading, keyword, setKeyword,
    statusFilter, isFreeOnly, setIsFreeOnly,
    statusFilters, handleSearch, handleStatusChange,
    handleLoadMore, navigateToDetail, navigateToCreate, fetchEvents,
  } = EventListFunction(navigation);

  useEffect(() => { fetchEvents(true); }, []);

  const renderCard = ({ item }: { item: EventDTO }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateToDetail(item.id)} activeOpacity={0.85}>
      <View>
        <Image
          source={{ uri: item.imageUrl ?? "https://via.placeholder.com/400x160" }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardImageOverlay}>
          <Text style={styles.cardStatusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={13} color={COLORS.muted} />
          <Text style={styles.cardMetaText} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.muted} />
          <Text style={styles.cardMetaText}>
            {new Date(item.startDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.cardFooter}>
          {item.isFree ? (
            <View style={styles.freeTag}>
              <Text style={styles.freeTagText}>FREE</Text>
            </View>
          ) : (
            <Text style={styles.priceText}>${item.price}</Text>
          )}
          <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.createBtn} onPress={navigateToCreate}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events…"
          placeholderTextColor={COLORS.muted}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={[...statusFilters]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, statusFilter === item && styles.chipActive]}
            onPress={() => handleStatusChange(item)}
          >
            <Text style={[styles.chipText, statusFilter === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={[styles.freeChip, isFreeOnly && styles.freeChipActive]}
            onPress={() => setIsFreeOnly(!isFreeOnly)}
          >
            <Text style={[styles.freeChipText, isFreeOnly && styles.freeChipTextActive]}>
              Free only
            </Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={events}
        renderItem={renderCard}
        keyExtractor={(item) => `event-${item.id}`}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.muted} />
              <Text style={styles.emptyText}>No events found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading ? <View style={styles.footerLoader}><ActivityIndicator color={COLORS.primary} /></View> : null
        }
      />
    </View>
  );
};

export default EventListScreen;
