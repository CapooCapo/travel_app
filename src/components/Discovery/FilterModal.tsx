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

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: { categories: string[]; radius: number | null }) => void;
  initialCategories: string[];
  initialRadius: number | null;
  categories: string[];
}

export const RADIUS_OPTIONS = [
  { label: "Any", value: null },
  { label: "1km", value: 1000 },
  { label: "5km", value: 5000 },
  { label: "10km", value: 10000 },
  { label: "20km", value: 20000 },
  { label: "50km", value: 50000 },
];

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  initialCategories,
  initialRadius,
  categories,
}) => {
  const [selectedCats, setSelectedCats] = React.useState<string[]>(initialCategories);
  const [selectedRadius, setSelectedRadius] = React.useState<number | null>(initialRadius);

  React.useEffect(() => {
    if (isVisible) {
      setSelectedCats(initialCategories);
      setSelectedRadius(initialRadius);
    }
  }, [isVisible, initialCategories, initialRadius]);

  const toggleCategory = (cat: string) => {
    setSelectedCats((prev) => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    onApply({
      categories: selectedCats,
      radius: selectedRadius,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCats([]);
    setSelectedRadius(null);
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
            <Text style={styles.title}>Filter Locations</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    selectedCats.includes(cat) && styles.chipActive,
                  ]}
                  onPress={() => toggleCategory(cat)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCats.includes(cat) && styles.chipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Search Radius</Text>
            <View style={styles.radiusGrid}>
              {RADIUS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.radiusBtn,
                    selectedRadius === opt.value && styles.radiusBtnActive,
                  ]}
                  onPress={() => setSelectedRadius(opt.value)}
                >
                  <Text
                    style={[
                      styles.radiusTxt,
                      selectedRadius === opt.value && styles.radiusTxtActive,
                    ]}
                  >
                    {opt.label}
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
    height: SCREEN_HEIGHT * 0.7,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "#3A3A3C",
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
    color: "#000",
    fontWeight: "600",
  },
  radiusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  radiusBtn: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  radiusBtnActive: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderColor: COLORS.primary,
  },
  radiusTxt: {
    color: COLORS.muted,
    fontSize: 14,
  },
  radiusTxtActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
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
    color: "#000", // Matches primary theme (usually yellow/blue with black text)
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FilterModal;
