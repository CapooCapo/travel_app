import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  heroImage: { width, height: 240 },
  heroOverlay: { position: "absolute", top: 0, left: 0, width, height: 240, backgroundColor: "rgba(0,0,0,0.35)" },
  heroActions: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: SIZES.padding },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  heroActionsRight: { flexDirection: "row", gap: 8 },
  statusBadge: { position: "absolute", bottom: 12, left: SIZES.padding, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusIncoming: { backgroundColor: COLORS.primary },
  statusOngoing: { backgroundColor: "#00c864" },
  statusCompleted: { backgroundColor: COLORS.muted },
  statusText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 11, textTransform: "uppercase" },

  content: { padding: SIZES.padding },
  title: { ...FONTS.h1, color: COLORS.text, marginBottom: 10 },

  countdownBox: { backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 12, marginBottom: 14, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  countdownLabel: { ...FONTS.body2, color: COLORS.muted, marginBottom: 4 },
  countdownValue: { ...FONTS.h2, color: COLORS.primary, fontWeight: "800" },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  infoText: { ...FONTS.body1, color: COLORS.text },
  infoMeta: { ...FONTS.body2, color: COLORS.muted },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
  sectionLabel: { ...FONTS.body2, color: COLORS.muted, fontWeight: "700", textTransform: "uppercase", marginBottom: 8 },
  description: { ...FONTS.body1, color: COLORS.text, lineHeight: 22 },

  organizerCard: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  organizerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center" },
  organizerName: { ...FONTS.body1, color: COLORS.text, fontWeight: "600" },
  organizerRole: { ...FONTS.body2, color: COLORS.muted },

  footer: { padding: SIZES.padding, borderTopWidth: 1, borderColor: COLORS.border, flexDirection: "row", gap: 10 },
  bookmarkBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border },
  chatBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  chatBtnText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },

  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
