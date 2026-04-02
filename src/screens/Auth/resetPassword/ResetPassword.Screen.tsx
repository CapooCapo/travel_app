import React from "react";
import {
  View, Text, TouchableOpacity, Image, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ResetPassword.Style";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import { ResetPasswordFunction } from "./ResetPassword.Function";

export default function ResetPasswordScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const email = route.params?.email || "";
  const otp = route.params?.otp || "";
  
  const {
    BG_IMAGE,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    handleResetPassword,
  } = ResetPasswordFunction(navigation, email, otp);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- LAYER 1: BACKGROUND --- */}
      <Image source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.overlay} />

      {/* --- LAYER 2: CONTENT --- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 50, paddingTop: insets.top }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.glassContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="key-outline" size={40} color="#fff" />
            </View>

            <Text style={styles.title}>New Password</Text>
            <Text style={styles.description}>
              Enter your new password below. Make sure it's strong and secure!
            </Text>

            <CustomInput
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <CustomInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
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
    </View>
  );
}
