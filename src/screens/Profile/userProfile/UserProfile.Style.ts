import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  iconBtn: {
    padding: 8,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.primary + "33",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.card,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  usernameText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },
  followBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  followBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  followingBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followingBtnText: {
    color: COLORS.text,
  },
  messageBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageBtnText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  interestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "1A",
    borderWidth: 1,
    borderColor: COLORS.primary + "33",
  },
  interestChipText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  styleChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundDark,
  },
  styleChipText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    padding: 12,
  },
  noDataText: {
    color: COLORS.muted,
    fontStyle: "italic",
    fontSize: 14,
  }
});
