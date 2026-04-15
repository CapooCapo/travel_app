import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SocialFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (types: string[]) => void;
  initialTypes: string[];
}

export const ACTIVITY_TYPES = [
  { label: "Follows", value: "FOLLOW" },
  { label: "Unfollows", value: "UNFOLLOW" },
  { label: "Events", value: "EVENT" },
  { label: "Bookmarks", value: "BOOKMARK" },
  { label: "Reviews", value: "REVIEW" },
];

const SocialFilterModal: React.FC<SocialFilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  initialTypes,
}) => {
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(initialTypes);

  React.useEffect(() => {
    if (isVisible) {
      setSelectedTypes(initialTypes);
    }
  }, [isVisible, initialTypes]);

  const toggleType = (val: string) => {
    setSelectedTypes((prev) => 
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const handleApply = () => {
    onApply(selectedTypes);
    onClose();
  };

  const handleReset = () => {
    setSelectedTypes([]);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Activities</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Activity Types</Text>
            <View style={styles.chipGrid}>
              {ACTIVITY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.chip,
                    selectedTypes.includes(type.value) && styles.chipActive,
                  ]}
                  onPress={() => toggleType(type.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedTypes.includes(type.value) && styles.chipTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetTxt}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyTxt}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.5,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  resetTxt: {
    color: COLORS.muted,
    fontSize: 16,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SocialFilterModal;
