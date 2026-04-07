import React from "react";
import {
  View, Text, TouchableOpacity, ImageBackground, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ResetPassword.Style";
import { useResetPassword } from "./useResetPassword";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";

export default function ResetPasswordScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const email = route?.params?.email || "";
  const otp = route?.params?.otp || "";

  const {
    BG_IMAGE,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    handleResetPassword,
  } = useResetPassword(navigation, email, otp);

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 50, paddingTop: insets.top }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.glassContainer}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons name="key-outline" size={40} color="#fff" />
              </View>
            </View>

            <Text style={styles.title}>New Password</Text>
            <Text style={styles.description}>
              Please create a new password that is different from previous passwords.
            </Text>

            <CustomInput
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              error={errors.password}
            />

            <CustomInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              error={errors.confirm}
            />

            <CustomButton
              title="RESET PASSWORD"
              onPress={handleResetPassword}
              isLoading={isLoading}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
