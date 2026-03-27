import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  heroImage: { width, height: 260 },
  heroOverlay: {
    position: "absolute", top: 0, left: 0,
    width, height: 260,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroActions: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
  },
  heroActionsRight: { flexDirection: "row", gap: 8 },

  contentContainer: { padding: SIZES.padding },
  name: { ...FONTS.h1, color: COLORS.text, marginBottom: 4 },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  addressText: { ...FONTS.body2, color: COLORS.muted, flex: 1 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  ratingText: { ...FONTS.body1, color: COLORS.text, fontWeight: "700" },
  reviewCount: { ...FONTS.body2, color: COLORS.muted },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  badgeText: { ...FONTS.body2, color: COLORS.text, textTransform: "capitalize" },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderColor: COLORS.primary },
  tabText: { ...FONTS.body2, color: COLORS.muted },
  tabTextActive: { color: COLORS.primary, fontWeight: "700" },

  description: { ...FONTS.body1, color: COLORS.text, lineHeight: 22, marginBottom: 16 },

  sectionLabel: { ...FONTS.body2, color: COLORS.muted, fontWeight: "700", marginBottom: 8, textTransform: "uppercase" },
  hoursText: { ...FONTS.body1, color: COLORS.text, marginBottom: 4 },

  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  reviewerName: { ...FONTS.body1, color: COLORS.text, fontWeight: "600" },
  reviewDate: { ...FONTS.body2, color: COLORS.muted },
  starRow: { flexDirection: "row", marginBottom: 6 },
  reviewText: { ...FONTS.body2, color: COLORS.muted, lineHeight: 18 },

  addReviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    marginTop: 8,
  },
  addReviewText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },

  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  directionsBtnText: { ...FONTS.body1, color: COLORS.text },

  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
