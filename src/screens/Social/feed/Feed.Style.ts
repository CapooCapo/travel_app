import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },

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

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 10 },
  emptySubText: { ...FONTS.body2, color: COLORS.muted, marginTop: 4, textAlign: "center", paddingHorizontal: 32 },
  listContent: { paddingBottom: 32 },
  footerLoader: { paddingVertical: 16, alignItems: "center" },
});
