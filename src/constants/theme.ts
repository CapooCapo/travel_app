import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");

export const palette = {
  inkBlack: "#001524",
  stormyTeal: "#15616D",
  papayaWhip: "#FFECD1",
  vividTangerine: "#FF7D00",
  brandy: "#78290F",
  white: "#FFFFFF",

};

// 2. Theme chính
export const theme = {
  colors: {
    bg: palette.inkBlack,
    card: palette.stormyTeal,
    surface: "rgba(255, 236, 209, 0.08)",
    text: palette.papayaWhip,
    muted: "rgba(255, 236, 209, 0.70)",
    primary: palette.vividTangerine,
    primaryText: palette.inkBlack,
    border: "rgba(255, 236, 209, 0.14)",
    inputBg: "rgba(255, 236, 209, 0.06)",
    danger: palette.brandy,
    textLight: palette.papayaWhip,
    glassBG: "rgba(255, 255, 255, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.3)",
    overlayDark: "rgba(0, 0, 0, 0.4)",
    borderColor: "rgba(255, 236, 209, 0.14)",
    gray: "#CCC5B9"
  },
  radius: { xl: 22, lg: 18, md: 14, sm: 12 },
  spacing: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 },
  font: { h1: 30, h2: 22, base: 15, small: 13 },
};

/* 3. PHẦN QUAN TRỌNG:
   Export lại các biến COLORS, SIZES, FONTS để các file cũ không bị lỗi
*/
export const COLORS = theme.colors;

export const SIZES = {
  // Map các giá trị spacing/radius sang cấu trúc SIZES cũ
  base: theme.spacing.xs,
  font: theme.font.base,
  radius: theme.radius.md,
  padding: theme.spacing.xl,

  // Kích thước màn hình
  width,
  height,

  // Giữ lại các giá trị cụ thể nếu cần
  h1: theme.font.h1,
  h2: theme.font.h2,
};

export const FONTS = {
  h1: { fontSize: theme.font.h1, fontWeight: "800" },
  h2: { fontSize: theme.font.h2, fontWeight: "700" },
  body1: { fontSize: theme.font.base },
  body2: { fontSize: theme.font.small },
};
