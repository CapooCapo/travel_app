import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, Image, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./ForgotPassword.Style";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import { authService } from "../../../services/auth.service";
import { isEmail } from "../../../services/validator";

export default function ForgotPasswordScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const BG_IMAGE = { uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070" };

  const handleResetPassword = async () => {
    const err = isEmail(email);
    if (err) { setEmailError(err); return; }

    setIsLoading(true);
    try {
      await authService.ForgotPassword(email);
      Alert.alert("Check your email", "Reset link sent!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- LAYER 1: NỀN CỐ ĐỊNH --- */}
      <Image source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.overlay} />

      {/* --- LAYER 2: NỘI DUNG --- */}
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
              <Ionicons name="lock-open-outline" size={40} color="#fff" />
            </View>

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.description}>
              Don't worry! It happens. Please enter the email address associated with your account.
            </Text>

            <CustomInput
              placeholder="Enter your email"
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(""); }}
              keyboardType="email-address"
              error={emailError}
            />

            <CustomButton
              title="SEND RESET LINK"
              onPress={handleResetPassword}
              isLoading={isLoading}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
