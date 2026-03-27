import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding, paddingVertical: 12,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  createBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
  },

  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding, marginBottom: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
  },
  searchInput: { flex: 1, ...FONTS.body1, color: COLORS.text },

  filterRow: { paddingHorizontal: SIZES.padding, paddingBottom: 10, gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border, marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...FONTS.body2, color: COLORS.muted, textTransform: "capitalize" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  freeChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: COLORS.primary, marginRight: 8,
  },
  freeChipActive: { backgroundColor: COLORS.primary },
  freeChipText: { ...FONTS.body2, color: COLORS.primary },
  freeChipTextActive: { color: "#fff", fontWeight: "700" },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius + 2,
    marginHorizontal: SIZES.padding, marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardImage: { width: "100%", height: 160 },
  cardImageOverlay: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  cardStatusText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 10 },
  cardBody: { padding: 12 },
  cardTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 4 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
  cardMetaText: { ...FONTS.body2, color: COLORS.muted },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  freeTag: {
    backgroundColor: "rgba(0,200,100,0.12)",
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2,
  },
  freeTagText: { ...FONTS.body2, color: "#00c864", fontWeight: "700", fontSize: 11 },
  priceText: { ...FONTS.body1, color: COLORS.primary, fontWeight: "700" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 8 },
  footerLoader: { paddingVertical: 16, alignItems: "center" },
  listContent: { paddingBottom: 20 },
});
