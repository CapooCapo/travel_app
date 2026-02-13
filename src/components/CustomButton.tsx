import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { theme } from "../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: "primary" | "outline";
  isLoading?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  disabled,
  loading,
  style,
  variant = "primary",
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isDisabled
          ? styles.disabledBase
          : (variant === "primary" ? styles.primary : styles.outline),
        pressed && !isDisabled ? styles.pressed : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[
            styles.text,
            isDisabled
              ? styles.textDisabled
              : (variant === "primary" ? styles.textPrimary : styles.textOutline)
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%", // <--- THÊM DÒNG NÀY: Để nút luôn giãn full chiều ngang container
    height: 52,
    borderRadius: theme.radius.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'transparent',
  },

  // Các style khác giữ nguyên
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  outline: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderColor: "#fff",
    borderWidth: 1,
  },

  disabledBase: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },

  pressed: { transform: [{ scale: 0.98 }] },

  text: { fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 },
  textPrimary: { color: "#fff" },
  textOutline: { color: "#fff" },
  textDisabled: { color: "rgba(255, 255, 255, 0.5)" },
});
