import React from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
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
        <View className="flex-row items-center justify-center">
          <ActivityIndicator color="white" size="small" />
          <Text className="text-white font-semibold text-lg ml-2">
            Đang xử lý...
          </Text>
        </View>
      );
    }

    if (status === "success") {
      return (
        <View className="flex-row items-center justify-center">
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Đăng nhập thành công
          </Text>
        </View>
      );
    }

    if (status === "error") {
      return (
        <View className="flex-row items-center justify-center">
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Lỗi đăng nhập
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-row items-center justify-center">
        <View className="bg-white p-1 rounded-full mr-3">
          <Ionicons name="logo-google" size={20} color="#4285F4" />
        </View>
        <Text className="text-white font-semibold text-lg">
          Tiếp tục với Google
        </Text>
      </View>
    );
  };

  const getBgColor = () => {
    if (status === "success") return "bg-green-500";
    if (status === "error") return "bg-red-500";
    return "bg-google-blue active:bg-blue-700";
  };

  return (
    <View className="w-full px-6 py-2">
      <Pressable
        onPress={onPress}
        disabled={disabled || isLoading}
        className={`w-full py-4 rounded-2xl shadow-lg flex-row items-center justify-center transition-all active:scale-95 duration-200 ${getBgColor()} ${
          disabled || isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
        {getButtonContent()}
      </Pressable>
      
      {status === "default" && !isLoading && (
        <Text className="text-gray-500 text-center mt-3 text-xs italic">
          Đăng nhập an toàn qua tài khoản Google của bạn
        </Text>
      )}
    </View>
  );
};
