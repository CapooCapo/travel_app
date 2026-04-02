import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

const { width, height } = Dimensions.get("screen");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  glassContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 25,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: { ...FONTS.h2, color: "#fff", textAlign: "center", marginBottom: 10 },
  description: {
    ...FONTS.body2,
    color: "#eee",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  backButton: { marginTop: 20, alignSelf: "center" },
  backButtonText: {
    color: COLORS.gray,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
