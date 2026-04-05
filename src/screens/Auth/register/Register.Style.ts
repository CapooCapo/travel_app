import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

// Lấy kích thước màn hình vật lý
const { width, height } = Dimensions.get("screen");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)", // Darker overlay for better readability
  },
  flexContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  glassContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 25,
    marginHorizontal: 20,
    marginTop: 20, // Thêm margin top để tránh sát tai thỏ khi scroll
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  title: {
    ...FONTS.h1,
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    ...FONTS.body1,
    color: "#eee",
    textAlign: "center",
    marginBottom: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { ...FONTS.body2, color: "#fff" },
  signInText: { color: COLORS.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
 },
});
