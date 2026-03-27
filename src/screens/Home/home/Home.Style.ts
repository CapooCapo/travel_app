import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { ...FONTS.body2, color: COLORS.muted },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchText: { ...FONTS.body1, color: COLORS.muted, flex: 1 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: { ...FONTS.h2, color: COLORS.text },
  seeAll: { ...FONTS.body2, color: COLORS.primary },

  placeCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius + 4,
    marginLeft: SIZES.padding,
    overflow: "hidden",
  },
  placeImage: { width: "100%", height: 140 },
  placeInfo: { padding: 12 },
  placeName: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 4 },
  placeCategory: { ...FONTS.body2, color: COLORS.muted },
  placeRatingRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 },
  placeRating: { ...FONTS.body2, color: COLORS.text },

  eventCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventImage: { width: 80, height: 80 },
  eventInfo: { flex: 1, padding: 10, justifyContent: "center" },
  eventTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 4 },
  eventMeta: { ...FONTS.body2, color: COLORS.muted },
  eventBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  eventBadgeText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 10 },

  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { ...FONTS.body2, color: COLORS.muted, textAlign: "center", marginTop: 12 },

  listContent: { paddingBottom: 32 },
  horizontalList: { paddingRight: SIZES.padding },
});
