import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "@constants/theme";

interface CustomInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;   // optional — Register doesn't use icons
  error?: string;
}

const CustomInput = ({
  icon,
  error,
  style,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}: CustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: SIZES.base * 2 }}>
      <View
        style={[
          styles.container,
          isFocused && { borderColor: COLORS.primary, borderWidth: 1.5 },
          !!error  && { borderColor: COLORS.danger,  borderWidth: 1.5 },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.textLight}
            style={styles.icon}
          />
        ) : null}

        <TextInput
          style={[styles.input, !icon && { paddingLeft: 0 }, style]}
          placeholderTextColor={COLORS.gray}
          autoCapitalize="none"
          {...props}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glassBG,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding / 1.5,
    paddingVertical: SIZES.base * 1.5,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  icon: {
    marginRight: SIZES.base,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    color: COLORS.textLight,
    ...FONTS.body1,
  },
  eyeIcon: {
    padding: SIZES.base / 2,
    opacity: 0.8,
  },
  errorText: {
    ...FONTS.body2,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomInput;
