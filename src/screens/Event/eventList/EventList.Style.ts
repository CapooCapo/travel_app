import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 4,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },

  // ─── Card ─────────────────────────────────────────────────────────────────
  listContent: { paddingBottom: 24, paddingTop: 8 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius + 2,
    marginHorizontal: SIZES.padding,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage:   { width: "100%", height: 160 },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "rgba(0,21,36,0.35)",
  },

  // Event count badge overlaid on image
  eventCountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eventCountText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 11 },

  cardBody:     { padding: 12 },
  cardTitle:    { ...FONTS.body1, color: COLORS.text, fontWeight: "700", marginBottom: 4 },
  cardMeta:     { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 2 },
  cardMetaText: { ...FONTS.body2, color: COLORS.muted, flex: 1 },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },

  // ─── Events preview ───────────────────────────────────────────────────────
  loadingRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  loadingText: { ...FONTS.body2, color: COLORS.muted },
  noEventsText:{ ...FONTS.body2, color: COLORS.muted },

  eventsList: { gap: 6 },
  eventPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventPillTitle: { ...FONTS.body2, color: COLORS.text, flex: 1 },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: { fontSize: 10, fontWeight: "700", color: "#fff" },

  moreEvents: { ...FONTS.body2, color: COLORS.primary, marginTop: 2 },

  // ─── States ───────────────────────────────────────────────────────────────
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText:      { ...FONTS.body1, color: COLORS.muted, marginTop: 8 },
  footerLoader:   { paddingVertical: 16, alignItems: "center" },
});
