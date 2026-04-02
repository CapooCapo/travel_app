import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },

  // ─── Hero ─────────────────────────────────────────────────────────────────
  heroWrapper:  { width, height: 280, position: "relative" },
  heroImage:    { width, height: 280 },
  heroGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 160 },
  heroActions: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
  },
  statusBadge: {
    position: "absolute",
    bottom: 12, left: SIZES.padding,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { ...FONTS.body2, color: "#fff", fontWeight: "700", fontSize: 11, textTransform: "uppercase" },

  // ─── Content ──────────────────────────────────────────────────────────────
  content: { padding: SIZES.padding },
  title:   { ...FONTS.h1, color: COLORS.text, marginBottom: 14 },

  // Countdown
  countdownBox: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  countdownLabel: { ...FONTS.body2, color: COLORS.muted, marginBottom: 4 },
  countdownValue: { ...FONTS.h2, color: COLORS.primary, fontWeight: "800" },

  // Info card
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 20,
    overflow: "hidden",
  },
  infoRow:     { flexDirection: "row", alignItems: "flex-start", padding: 14, gap: 12 },
  infoIcon: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: "rgba(255,125,0,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  infoDivider: { height: 1, backgroundColor: COLORS.border },
  infoLabel:   { ...FONTS.body2, color: COLORS.muted, marginBottom: 2 },
  infoText:    { ...FONTS.body1, color: COLORS.text },
  infoMeta:    { ...FONTS.body2, color: COLORS.muted, marginTop: 1 },

  // Description
  sectionLabel: {
    ...FONTS.body2, color: COLORS.muted,
    fontWeight: "700", textTransform: "uppercase",
    marginBottom: 8,
  },
  description: { ...FONTS.body1, color: COLORS.text, lineHeight: 22 },

  // ─── Footer ───────────────────────────────────────────────────────────────
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1, borderColor: COLORS.border,
  },
  primaryBtn: {
    height: 50, borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8,
  },
  primaryBtnText: { ...FONTS.body1, color: "#fff", fontWeight: "700" },
});
