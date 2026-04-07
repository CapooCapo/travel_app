import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SIZES.padding, paddingVertical: 12, gap: 8,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  createGroupBtn: {
    padding: 4,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  unreadBadgeText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 11 },

  chatItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SIZES.padding, paddingVertical: 14,
    borderBottomWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.card,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatarText: { ...FONTS.body1, color: COLORS.text, fontWeight: "700", fontSize: 18 },
  groupDot: {
    position: "absolute", bottom: 0, right: 0,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: COLORS.bg,
  },
  chatInfo: { flex: 1, justifyContent: "center" },
  chatName: { ...FONTS.body1, color: COLORS.text, fontWeight: "600", marginBottom: 3 },
  lastMessage: { ...FONTS.body2, color: COLORS.muted },
  chatMeta: { alignItems: "flex-end", gap: 4 },
  chatTime: { ...FONTS.body2, color: COLORS.muted, fontSize: 11 },
  unreadCount: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadCountText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 11 },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 10 },
  emptySubText: { ...FONTS.body2, color: COLORS.muted, marginTop: 4, textAlign: "center" },
  listContent: { paddingBottom: 32 },
});
