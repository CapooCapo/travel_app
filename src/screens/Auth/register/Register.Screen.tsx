import {
  View, Text, TouchableOpacity, ImageBackground,
  StatusBar, KeyboardAvoidingView,
  Platform, ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./Register.Style";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { useRegister } from "./useRegister";

export default function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const {
    fullName,
    email,
    password,
    confirmPassword,
    code,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setCode,
    errors,
    isLoading,
    pendingVerification,
    handleRegister,
    handleVerify,
  } = useRegister(navigation);
  
  const BG_IMAGE = require("@assets/images/signInbackground.jpg");

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingTop: insets.top }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.glassContainer}>
            {pendingVerification ? (
              <>
                <Text style={styles.title}>Verify Email</Text>
                <Text style={styles.subtitle}>We've sent a 6-digit code to {email}</Text>

                <CustomInput
                  placeholder="6-digit Code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  error={errors.code}
                />

                <CustomButton
                  title="VERIFY & JOIN"
                  onPress={handleVerify}
                  isLoading={isLoading}
                />

                <TouchableOpacity 
                  style={{ marginTop: 15 }} 
                  onPress={() => handleRegister()} // This would resend the code if implemented in backend, but Clerk preparation logic works here too
                >
                  <Text style={[styles.footerText, { textAlign: 'center', color: '#fff', opacity: 0.8 }]}>
                    Didn't receive a code? <Text style={styles.signInText}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
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
                  secureTextEntry={true}
                  error={errors.password}
                />

                <CustomInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  error={errors.confirm}
                />

                <CustomButton
                  title="SIGN UP"
                  onPress={handleRegister}
                  isLoading={isLoading}
                />

                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                    <Text style={styles.signInText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
