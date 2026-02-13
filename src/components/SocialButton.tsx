// SocialButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  type: "google" | "facebook";
}

const SocialButton: React.FC<SocialButtonProps> = ({ title, onPress, type }) => {
  // Chọn icon và màu sắc dựa trên loại nút
  const iconName = type === "google" ? "google" : "facebook";
  // Với style mới, ta dùng màu trắng cho icon để nổi trên nền tối
  const iconColor = COLORS.textLight;

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <FontAwesome name={iconName} size={20} color={iconColor} style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Style dạng Outline (viền)
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    borderRadius: SIZES.radius * 2,
    paddingVertical: SIZES.padding * 0.6,
    marginVertical: SIZES.base / 2,
    width: "100%",
  },
  icon: {
    marginRight: SIZES.base,
  },
  buttonText: {
    color: COLORS.textLight,
    ...FONTS.body2,
    fontWeight: "600",
  },
});

export default SocialButton;
