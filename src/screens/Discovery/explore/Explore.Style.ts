import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

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
  searchInput: {
    flex: 1,
    ...FONTS.body1,
    color: COLORS.text,
  },

  categoryRow: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: { ...FONTS.body2, color: COLORS.muted, textTransform: "capitalize" },
  categoryChipTextActive: { color: "#fff", fontWeight: "700" },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 10, justifyContent: "space-between" },
  cardName: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 2 },
  cardAddress: { ...FONTS.body2, color: COLORS.muted, marginBottom: 4 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardRating: { flexDirection: "row", alignItems: "center", gap: 3 },
  cardRatingText: { ...FONTS.body2, color: COLORS.text },
  cardPriceTag: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardPriceText: { ...FONTS.body2, color: COLORS.primary, fontWeight: "600", fontSize: 11 },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 8 },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    marginVertical: 8,
  },
  recentTitle: { ...FONTS.body2, color: COLORS.muted, fontWeight: "600" },
  recentClear: { ...FONTS.body2, color: COLORS.primary },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    gap: 10,
  },
  recentText: { ...FONTS.body1, color: COLORS.text },

  footerLoader: { paddingVertical: 16, alignItems: "center" },
});
