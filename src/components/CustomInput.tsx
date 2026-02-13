// CustomInput.tsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";

interface CustomInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // State để theo dõi focus

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[
      styles.container,
      // Đổi màu viền khi người dùng bấm vào input
      isFocused && { borderColor: COLORS.primary, borderWidth: 1.5 }
    ]}>
      <Ionicons name={icon} size={20} color={COLORS.textLight} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray} // Màu placeholder sáng hơn
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glassBG, // Nền bán trong suốt
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding / 1.5,
    paddingVertical: SIZES.base * 1.5,
    marginBottom: SIZES.base * 2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder, // Viền sáng nhẹ
  },
  icon: {
    marginRight: SIZES.base,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    color: COLORS.textLight, // Chữ màu trắng
    ...FONTS.body1,
  },
  eyeIcon: {
    padding: SIZES.base / 2,
    opacity: 0.8,
  },
});

export default CustomInput;
