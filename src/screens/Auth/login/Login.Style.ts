import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, FONTS } from "../../../constants/theme";

// Lấy kích thước màn hình vật lý (Bao gồm cả thanh trạng thái)
const { width, height } = Dimensions.get("screen");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark, // Màu nền dự phòng
  },
  // --- BACKGROUND TUYỆT ĐỐI (SỬA LẠI PHẦN NÀY) ---
  backgroundImage: {
    position: "absolute", // Quan trọng: Tách khỏi layout
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: -1, // Nằm dưới cùng
  },
  overlay: {
    position: "absolute", // Overlay cũng phải tuyệt đối theo ảnh
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.4)", // Lớp phủ tối
    zIndex: -1,
  },
  // ------------------------------------------------

  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 50, // Thêm đệm dưới để khi bàn phím lên không bị sát quá
  },

  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 25,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    // Hiệu ứng bóng đổ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  // ... (Các style text/button khác giữ nguyên) ...
  title: { ...FONTS.h1, color: "#fff", textAlign: "center", marginBottom: 5 },
  subtitle: {
    ...FONTS.body1,
    color: "#eee",
    textAlign: "center",
    marginBottom: 30,
  },
  forgotPassword: { alignSelf: "flex-end", marginVertical: 15 },
  forgotPasswordText: { color: "#fff", fontWeight: "600" },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.5)" },
  orText: { marginHorizontal: 10, color: "#fff", fontWeight: "600" },

  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { color: "#fff" },
  signUp: {
    color: COLORS.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
