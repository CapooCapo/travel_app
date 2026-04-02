import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");

export const palette = {
  white: "#FFFFFF",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate500: "#64748B",
  slate800: "#1E293B",
  slate900: "#0F172A",
  vividTangerine: "#FF7D00",
  brandy: "#78290F",
};

// 2. Theme chính (Light Theme)
export const theme = {
  colors: {
    bg: palette.slate50,
    backgroundDark: palette.slate100,
    card: palette.white,
    surface: palette.slate100,
    text: palette.slate900,
    muted: palette.slate500,
    primary: palette.vividTangerine,
    primaryText: palette.white,
    border: palette.slate200,
    inputBg: palette.white,
    danger: "#EF4444",
    textLight: palette.white,
    glassBG: "rgba(206, 206, 206, 0.8)",
    glassBorder: "rgba(255, 255, 255, 0.4)",
    overlayDark: "rgba(0, 0, 0, 0.3)",
    borderColor: palette.slate200,
    gray: "#e6e5e5ff",
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
  h1: { fontSize: theme.font.h1, fontWeight: "800" as const },
  h2: { fontSize: theme.font.h2, fontWeight: "700" as const },
  body1: { fontSize: theme.font.base },
  body2: { fontSize: theme.font.small },
};
