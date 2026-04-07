import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSchedule } from "../../../context/ScheduleContext";
import { useScheduleLogic } from "./Schedule.Function";
import { styles } from "./Schedule.Style";
import { COLORS } from "../../../constants/theme";
import { ShareService } from "../../../services/ShareService";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, TextInput, Platform } from "react-native";

const ScheduleScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { schedules, isLoading, fetchSchedules } = useSchedule();
  const { handleDelete, handleAdd } = useScheduleLogic();

  // Modal State
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [notes, setNotes] = React.useState("");
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [targetLocation, setTargetLocation] = React.useState<any>(null);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    if (route.params?.location) {
      setTargetLocation(route.params.location);
      setIsModalVisible(true);
      // Clear params to avoid reopening on remount
      navigation.setParams({ location: null });
    }
  }, [route.params, navigation]);

  const onDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) {
      setSelectedDate(selected);
    }
  };

  const handleConfirmAdd = async () => {
    if (!targetLocation) return;
    const success = await handleAdd(targetLocation.id, selectedDate, notes);
    if (success) {
      setIsModalVisible(false);
      setNotes("");
      setSelectedDate(new Date());
      setTargetLocation(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.locationName} numberOfLines={1}>
          {item.locationName}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.muted} />
        <Text style={styles.dateText}>{item.scheduledDate}</Text>
      </View>

      {item.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Schedules</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => ShareService.shareSchedules(schedules)} style={{ marginRight: 15 }}>
            <Ionicons name="share-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
            <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : schedules.length > 0 ? (
        <FlatList
          data={schedules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchSchedules}
          refreshing={isLoading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-clear-outline"
            size={80}
            color={COLORS.muted}
          />
          <Text style={styles.emptyText}>No schedules found</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Discovery")}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>

      {/* Scheduling Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Visit</Text>
            <Text style={styles.modalSubtitle}>{targetLocation?.name}</Text>

            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.dateSelectorText}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Bring a camera, check opening hours..."
              placeholderTextColor={COLORS.muted}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setTargetLocation(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmAdd}
                disabled={isLoading}
              >
                <Text style={styles.confirmButtonText}>
                  {isLoading ? "Saving..." : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScheduleScreen;
