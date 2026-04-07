import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SIZES.padding, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: COLORS.border, gap: 10,
  },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1 },
  chatName: { ...FONTS.body1, color: COLORS.text, fontWeight: "700" },
  chatType: { ...FONTS.body2, color: COLORS.muted },

  pinnedBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primary + "18",
    paddingHorizontal: SIZES.padding, paddingVertical: 8, gap: 8,
    borderBottomWidth: 1, borderColor: COLORS.primary + "44",
  },
  pinnedText: { ...FONTS.body2, color: COLORS.primary, flex: 1 },

  messagesList: { paddingHorizontal: SIZES.padding, paddingVertical: 12 },

  // Bubble out (mine)
  bubbleOut: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderRadius: 18, borderBottomRightRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 6, maxWidth: width * 0.72,
  },
  bubbleOutText: { ...FONTS.body2, color: "#fff", lineHeight: 18 },
  bubbleOutTime: { ...FONTS.body2, color: "rgba(255,255,255,0.65)", fontSize: 10, marginTop: 3, textAlign: "right" },

  // Bubble in (others)
  bubbleInRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 8 },
  bubbleInWrapper: { alignSelf: "flex-start", maxWidth: width * 0.72 },
  avatarMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface },
  avatarPlaceholderMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border },
  bubbleSenderName: { ...FONTS.body2, color: COLORS.primary, fontWeight: "600", marginBottom: 3, marginLeft: 4 },
  bubbleIn: {
    backgroundColor: COLORS.card,
    borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  bubbleInText: { ...FONTS.body2, color: COLORS.text, lineHeight: 18 },
  bubbleInTime: { ...FONTS.body2, color: COLORS.muted, fontSize: 10, marginTop: 3 },

  // Input bar
  inputBar: {
    flexDirection: "row", alignItems: "flex-end",
    paddingHorizontal: SIZES.padding, paddingVertical: 10,
    borderTopWidth: 1, borderColor: COLORS.border,
    gap: 10, backgroundColor: COLORS.bg,
  },
  inputWrapper: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
    minHeight: 40, maxHeight: 100, justifyContent: "center",
  },
  textInput: { ...FONTS.body2, color: COLORS.text, padding: 0 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnActive: { backgroundColor: COLORS.primary },
  sendBtnInactive: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },

  messageImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 12,
    marginTop: 2,
    marginBottom: 4,
  },

  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
