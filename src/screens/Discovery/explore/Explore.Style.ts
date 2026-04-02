import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 4,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },

  // ─── Search ───────────────────────────────────────────────────────────────
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginVertical: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: { flex: 1, ...FONTS.body1, color: COLORS.text },

  // ─── Category chips ────────────────────────────────────────────────────────
  chipRow: { paddingHorizontal: SIZES.padding, paddingBottom: 20, gap: 8 },
  chip: {
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText:       { ...FONTS.body2, color: COLORS.muted, textTransform: "capitalize" },
  chipTextActive: { color: "#fff", fontWeight: "700" },

  // ─── Place card ───────────────────────────────────────────────────────────
  listContent: { paddingBottom: 24 },
  card: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage:   { width: 100, height: 100 },
  cardInfo:    { flex: 1, padding: 10, justifyContent: "space-between" },
  cardName:    { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 2 },
  cardRow:     { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  cardAddress: { ...FONTS.body2, color: COLORS.muted, flex: 1 },

  cardFooter:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardRating:       { flexDirection: "row", alignItems: "center", gap: 3 },
  cardRatingText:   { ...FONTS.body2, color: COLORS.text },
  cardCategory: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardCategoryText: { ...FONTS.body2, color: COLORS.primary, fontWeight: "600", fontSize: 11 },

  // ─── Recent searches ──────────────────────────────────────────────────────
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    marginVertical: 8,
  },
  recentTitle: { ...FONTS.body2, color: COLORS.muted, fontWeight: "600" },
  recentItem:  { flexDirection: "row", alignItems: "center", paddingHorizontal: SIZES.padding, paddingVertical: 10, gap: 10 },
  recentText:  { ...FONTS.body1, color: COLORS.text },

  // ─── States ───────────────────────────────────────────────────────────────
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText:      { ...FONTS.body1, color: COLORS.muted, marginTop: 8 },
  footerLoader:   { paddingVertical: 16, alignItems: "center" },
});
