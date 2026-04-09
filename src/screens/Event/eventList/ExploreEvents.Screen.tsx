import React from "react";
import {
  View, Text, FlatList, TouchableOpacity, Image,
  TextInput, ScrollView, RefreshControl, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ExploreEvents.Style";
import { useExploreEvents } from "./useExploreEvents";
import { COLORS } from "../../../constants/theme";
import { EventResponse } from "../../../dto/event/event.DTO";

const CATEGORIES = ["Music", "Workshop", "Social", "Food", "Sport", "Business"];

const ExploreEventsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    events, isLoading, activeTab, setActiveTab,
    filters, handleSearch, applyFilters, loadMore, refresh
  } = useExploreEvents();

  const renderEvent = ({ item }: { item: EventResponse }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate("EventDetail", { event: item })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: (item.images && item.images.length > 0) ? item.images[0] : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600" }}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.priceText}>{item.price === null || item.price <= 0 ? "FREE" : `$${item.price}`}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
          <Text style={styles.metaText}>{new Date(item.startTime).toLocaleDateString()}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.muted} />
          <Text style={styles.metaText} numberOfLines={1}>{item.address}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.startTime}>
             {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Events</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            value={filters.keyword}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={{ height: 60 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ paddingRight: 40 }}
        >
          <TouchableOpacity
            style={[styles.filterChip, filters.isFree && styles.activeFilterChip]}
            onPress={() => applyFilters({ isFree: !filters.isFree })}
          >
            <Ionicons name="ticket" size={14} color={filters.isFree ? "#fff" : COLORS.muted} />
            <Text style={[styles.filterText, filters.isFree && styles.activeFilterText]}>Free</Text>
          </TouchableOpacity>

          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, filters.category === cat && styles.activeFilterChip]}
              onPress={() => applyFilters({ category: filters.category === cat ? "" : cat })}
            >
              <Text style={[styles.filterText, filters.category === cat && styles.activeFilterText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tabs}>
        {['INCOMING', 'ONGOING', 'COMPLETED'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color={COLORS.muted} />
              <Text style={styles.emptyText}>No events found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading && events.length > 0 ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : null
        }
      />
      
      <TouchableOpacity 
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          right: 20,
          backgroundColor: COLORS.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => navigation.navigate("CreateEvent")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ExploreEventsScreen;
