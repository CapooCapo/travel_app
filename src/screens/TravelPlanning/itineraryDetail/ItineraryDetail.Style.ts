import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },

  // ─── Header ─────────────────────────────────────────────────────────────
  headerHero: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.padding,
    paddingTop: 14,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  pageTitle: { ...FONTS.h1, color: COLORS.text, marginBottom: 6 },
  pageDates: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  pageDatesText: { ...FONTS.body1, color: COLORS.primary, fontWeight: "600" },
  pageDesc: { ...FONTS.body2, color: COLORS.muted, marginTop: 4, lineHeight: 20 },

  // ─── List Layout ────────────────────────────────────────────────────────
  listContent: { padding: SIZES.padding, paddingBottom: 60 },
  dayBlock: { marginBottom: 30 },
  dayHeader: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12
  },
  dayIndicator: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
  },
  dayIndicatorText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  dayHeaderText: { ...FONTS.h2, color: COLORS.text },
  emptyDayText: { ...FONTS.body2, color: COLORS.muted, marginLeft: 32 },

  // ─── Item Timeline Card ─────────────────────────────────────────────────
  timelineRow: { flexDirection: "row", marginBottom: 16 },
  timelineLine: {
    width: 24, alignItems: "center", marginRight: 8,
  },
  dot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary,
    borderWidth: 2, borderColor: COLORS.bg, zIndex: 2
  },
  line: {
    position: "absolute",
    top: 12, bottom: -16,
    width: 2, backgroundColor: COLORS.border,
    zIndex: 1
  },
  card: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: "row", gap: 10,
  },
  cardIconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: "rgba(255,125,0,0.1)",
    alignItems: "center", justifyContent: "center"
  },
  cardContent: { flex: 1, justifyContent: "center" },
  cardTime: { ...FONTS.body2, color: COLORS.primary, fontWeight: "700", marginBottom: 2 },
  cardTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "700" },
  cardDesc: { ...FONTS.body2, color: COLORS.muted, marginTop: 2 },
  
  // Reorder UI
  reorderBox: {
    justifyContent: "center", alignItems: "center", paddingLeft: 8,
    borderLeftWidth: 1, borderColor: COLORS.border,
    gap: 12
  },

  // Actions
  deleteBtn: {
    position: "absolute", top: -8, right: -8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: "center", justifyContent: "center",
    zIndex: 10,
    borderWidth: 2, borderColor: COLORS.bg
  },

  addStopBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: COLORS.surface,
    alignSelf: "flex-start",
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, marginLeft: 32,
    borderWidth: 1, borderColor: COLORS.primary
  },
  addStopText: { ...FONTS.body2, color: COLORS.primary, fontWeight: "600" },
  
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" }
});
