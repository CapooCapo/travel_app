import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SIZES.padding, paddingVertical: 12,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.text },
  emptyTitle: { ...FONTS.h1, color: COLORS.text, fontWeight: "700" },
  
  content: { paddingBottom: 32 },
  
  card: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding, marginBottom: 12,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  locationName: { ...FONTS.body1, fontWeight: "700", color: COLORS.text, flex: 1 },
  dateContainer: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  dateText: { ...FONTS.body2, color: COLORS.muted },
  notes: { ...FONTS.body2, color: COLORS.text, fontStyle: "italic" },
  
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { ...FONTS.body1, color: COLORS.muted, marginTop: 10 },
  
  fab: {
    position: "absolute", right: 24, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3.84,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 24,
  },
  label: {
    ...FONTS.body2,
    fontWeight: "700",
    color: COLORS.muted,
    marginBottom: 8,
    marginTop: 16,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateSelectorText: {
    ...FONTS.body1,
    color: COLORS.text,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    ...FONTS.body1,
    color: COLORS.text,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    ...FONTS.body1,
    fontWeight: "600",
    color: COLORS.text,
  },
  confirmButtonText: {
    ...FONTS.body1,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
