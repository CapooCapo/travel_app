import React from "react";
import {
  View, Text, TouchableOpacity, ImageBackground, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./OtpVerification.Style";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { OtpVerificationFunction } from "./OtpVerification.Function";

export default function OtpVerificationScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const email = route.params?.email || "";
  
  const {
    BG_IMAGE,
    otp,
    setOtp,
    otpError,
    isLoading,
    handleVerifyOtp,
    handleResend,
  } = OtpVerificationFunction(navigation, email);

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
                <Ionicons name="mail-unread-outline" size={40} color="#fff" />
              </View>
            </View>

            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.description}>
              We've sent a 6-digit verification code to {email}.
            </Text>

            <CustomInput
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              error={otpError}
            />

            <CustomButton
              title="VERIFY OTP"
              onPress={handleVerifyOtp}
              isLoading={isLoading}
            />
            
            <TouchableOpacity style={{ marginTop: 20, alignSelf: "center" }} onPress={handleResend}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Didn't receive code? <Text style={{ textDecorationLine: "underline" }}>Resend</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Incorrect email? Go back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
