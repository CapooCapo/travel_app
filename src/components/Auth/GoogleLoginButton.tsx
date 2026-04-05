import React from "react";
import { View, Text, ActivityIndicator, Pressable, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GoogleLoginButtonProps {
  onPress: () => Promise<void>;
  isLoading?: boolean;
  status?: "default" | "success" | "error";
  disabled?: boolean;
}

/**
 * GoogleLoginButton - Một thành phần UI cao cấp cho phép đăng nhập bằng Google.
 */
export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onPress,
  isLoading = false,
  status = "default",
  disabled = false,
}) => {
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <View style={styles.buttonContentInner}>
          <ActivityIndicator color="white" size="small" />
          <Text style={styles.buttonText}>
            Đang xử lý...
          </Text>
        </View>
      );
    }

    if (status === "success") {
      return (
        <View style={styles.buttonContentInner}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.buttonText}>
            Đăng nhập thành công
          </Text>
        </View>
      );
    }

    if (status === "error") {
      return (
        <View style={styles.buttonContentInner}>
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text style={styles.buttonText}>
            Lỗi đăng nhập
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.buttonContentInner}>
        <View style={styles.googleIconWrapper}>
          <Image 
            source={require("../../../assets/images/google-icon.png")} 
            style={styles.googleIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.buttonText}>
          Tiếp tục với Google
        </Text>
      </View>
    );
  };

  const getBgColor = () => {
    if (status === "success") return "#22c55e"; // bg-green-500
    if (status === "error") return "#ef4444"; // bg-red-500
    return "#4285F4"; // Google Blue
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        disabled={disabled || isLoading}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? "#357ae8" : getBgColor() }, // Darker blue on press
          (disabled || isLoading) ? styles.disabled : styles.enabled,
          pressed && styles.pressed
        ]}
      >
        {getButtonContent()}
      </Pressable>
      
      {status === "default" && !isLoading && (
        <Text style={styles.helperText}>
          Đăng nhập an toàn qua tài khoản Google của bạn
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  buttonContentInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconWrapper: {
    backgroundColor: "#ffffff",
    padding: 6,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  helperText: {
    color: "#6b7280", // text-gray-500
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    fontStyle: "italic",
  },
  disabled: {
    opacity: 0.6,
  },
  enabled: {
    opacity: 1,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  }
});
