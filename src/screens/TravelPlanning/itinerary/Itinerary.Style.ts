import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SIZES.padding, paddingVertical: 12,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center",
  },

  card: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius + 2,
    marginHorizontal: SIZES.padding, marginBottom: 12,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", flex: 1, marginRight: 8 },
  shareBtn: { padding: 2 },
  cardDates: {
    flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6,
  },
  cardDatesText: { ...FONTS.body2, color: COLORS.muted },
  cardStats: { flexDirection: "row", gap: 16, marginTop: 8 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { ...FONTS.body2, color: COLORS.muted },

  dayBadgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  dayBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  dayBadgeText: { ...FONTS.body2, color: COLORS.text, fontSize: 11 },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 10 },
  emptySubText: { ...FONTS.body2, color: COLORS.muted, marginTop: 4, textAlign: "center" },
  listContent: { paddingBottom: 32 },
});
