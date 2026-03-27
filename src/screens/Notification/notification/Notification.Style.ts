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
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  markAllText: { ...FONTS.body2, color: COLORS.primary, fontWeight: "600" },
  badge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2, marginLeft: 6,
  },
  badgeText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 11 },

  item: {
    flexDirection: "row", alignItems: "flex-start",
    paddingHorizontal: SIZES.padding, paddingVertical: 14,
    borderBottomWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  itemUnread: { backgroundColor: COLORS.surface },
  iconWrapper: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  itemContent: { flex: 1 },
  itemTitle: { ...FONTS.body1, color: COLORS.text, fontWeight: "600", marginBottom: 2 },
  itemBody: { ...FONTS.body2, color: COLORS.muted, lineHeight: 18 },
  itemTime: { ...FONTS.body2, color: COLORS.muted, fontSize: 11, marginTop: 4 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.primary, marginTop: 6,
  },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 8 },
  listContent: { paddingBottom: 32 },
});
