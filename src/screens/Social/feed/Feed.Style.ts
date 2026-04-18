import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text, marginBottom: 12 },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    marginLeft: 10,
    ...FONTS.body1,
    fontSize: 14,
  },
  searchIcon: { marginRight: 4 },

  // User Search Item
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + "22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "44",
  },
  userAvatarText: { ...FONTS.h2, color: COLORS.primary },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { ...FONTS.h2, color: COLORS.text, fontWeight: "700" },
  userEmail: { ...FONTS.body2, color: COLORS.muted, fontSize: 12, marginTop: 2 },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  followButtonText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatarText: { ...FONTS.body1, color: COLORS.text, fontWeight: "700" },
  content: { flex: 1 },
  message: { ...FONTS.body2, color: COLORS.text, lineHeight: 20, flexWrap: "wrap" },
  nameHighlight: { color: COLORS.primary, fontWeight: "700" },
  targetHighlight: { color: COLORS.text, fontWeight: "600" },
  time: { ...FONTS.body2, color: COLORS.muted, fontSize: 11, marginTop: 4 },
  typeIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    marginTop: 6,
  },
  itemFollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  itemFollowText: { color: "#FFF", fontSize: 10, fontWeight: "700" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 10 },
  emptySubText: { ...FONTS.body2, color: COLORS.muted, marginTop: 4, textAlign: "center", paddingHorizontal: 32 },
  listContent: { paddingBottom: 32 },
  footerLoader: { paddingVertical: 16, alignItems: "center" },
});
