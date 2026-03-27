import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  headerBg: {
    backgroundColor: COLORS.card,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    paddingTop: 20,
  },
  editBtn: {
    position: "absolute", top: 16, right: SIZES.padding,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  editBtnText: { ...FONTS.body2, color: COLORS.text },

  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: COLORS.primary,
    marginBottom: 10,
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  displayName: { ...FONTS.h2, color: COLORS.text, fontWeight: "700" },
  emailText: { ...FONTS.body2, color: COLORS.muted, marginTop: 2 },

  section: { marginHorizontal: SIZES.padding, marginTop: 20 },
  sectionTitle: {
    ...FONTS.body2, color: COLORS.muted, fontWeight: "700",
    textTransform: "uppercase", marginBottom: 10,
  },

  inputRow: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  inputLabel: { ...FONTS.body2, color: COLORS.muted, marginBottom: 4 },
  inputValue: { ...FONTS.body1, color: COLORS.text },
  textInput: { ...FONTS.body1, color: COLORS.text },

  styleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  styleChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  styleChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  styleChipText: { ...FONTS.body2, color: COLORS.muted, textTransform: "capitalize" },
  styleChipTextActive: { color: "#fff", fontWeight: "700" },

  interestRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  interestChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 16, borderWidth: 1,
    borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  interestChipActive: { backgroundColor: COLORS.primary + "33", borderColor: COLORS.primary },
  interestChipText: { ...FONTS.body2, color: COLORS.muted, textTransform: "capitalize" },
  interestChipTextActive: { color: COLORS.primary, fontWeight: "700" },

  menuItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border,
    gap: 12,
  },
  menuItemText: { ...FONTS.body1, color: COLORS.text, flex: 1 },

  saveBtn: {
    marginHorizontal: SIZES.padding, marginTop: 24,
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    paddingVertical: 14, alignItems: "center",
  },
  saveBtnText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },

  signOutBtn: {
    marginHorizontal: SIZES.padding, marginTop: 12, marginBottom: 32,
    backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: COLORS.danger + "66",
  },
  signOutText: { ...FONTS.body1, color: COLORS.danger, fontWeight: "600" },
});
