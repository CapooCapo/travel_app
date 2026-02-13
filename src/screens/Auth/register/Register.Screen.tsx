import React from "react";
import {
  View, Text, TouchableOpacity, Image,
  StatusBar, KeyboardAvoidingView,
  Platform, ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./Register.Style";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import {RegisterFunction} from "./Register.function";

export default function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const {
    fullName,
    email,
    password,
    confirmPassword,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    errors,
    isLoading,
    handleRegister,
  } = RegisterFunction(navigation);

  const BG_IMAGE = { uri: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021" };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Image source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingTop: insets.top }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.glassContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the adventure today</Text>

            <CustomInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
            />

            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />

            <CustomInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <CustomInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirm}
            />

            <CustomButton
              title="SIGN UP"
              onPress={handleRegister}
              isLoading={isLoading}
            />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

