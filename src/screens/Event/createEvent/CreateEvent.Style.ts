import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  content: { padding: SIZES.padding },
  label: { ...FONTS.body2, color: COLORS.muted, marginBottom: 6, fontWeight: "600", textTransform: "uppercase" },
  input: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 12,
    ...FONTS.body1, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 14,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 10, marginBottom: 14 },
  halfInput: { flex: 1, backgroundColor: COLORS.surface, borderRadius: SIZES.radius, paddingHorizontal: 14, paddingVertical: 12, ...FONTS.body1, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  freeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14 },
  freeLabel: { ...FONTS.body1, color: COLORS.text },
  toggleTrack: { width: 44, height: 24, borderRadius: 12, justifyContent: "center", paddingHorizontal: 3 },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff" },
  hint: { ...FONTS.body2, color: COLORS.muted, marginBottom: 20, fontStyle: "italic" },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  submitBtnText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },
  submitBtnDisabled: { opacity: 0.5 },
});
