import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SIZES.padding, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonDisabled: { opacity: 0.5 },
  createButtonText: { ...FONTS.body2, color: "#fff", fontWeight: "700" },

  form: { padding: SIZES.padding, gap: 16 },
  inputLabel: { ...FONTS.body2, color: COLORS.muted, marginBottom: 8 },
  nameInput: {
    backgroundColor: COLORS.card, borderRadius: 12,
    padding: 14, color: COLORS.text, ...FONTS.body1,
    borderWidth: 1, borderColor: COLORS.border,
  },

  searchContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.card, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 8,
  },
  searchInput: { flex: 1, color: COLORS.text, ...FONTS.body1, marginLeft: 8 },

  selectedCount: {
    ...FONTS.body2, color: COLORS.primary, fontWeight: "600",
    marginBottom: 12, paddingHorizontal: SIZES.padding,
  },

  listContent: { paddingHorizontal: SIZES.padding, paddingBottom: 32 },
  
  userItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: COLORS.border, gap: 12,
  },
  userItemActive: { backgroundColor: COLORS.primary + "11" },
  
  userAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.card, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  userAvatarText: { ...FONTS.body1, color: COLORS.text, fontWeight: "700" },
  
  userInfo: { flex: 1 },
  userName: { ...FONTS.body1, color: COLORS.text, fontWeight: "600" },
  userEmail: { ...FONTS.body2, color: COLORS.muted, fontSize: 13 },
  
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.muted,
    alignItems: "center", justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 10 },
});
