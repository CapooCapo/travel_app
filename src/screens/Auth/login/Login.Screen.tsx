import React from "react";
import {
  View,
  Text,
  Image, // Dùng Image thay vì ImageBackground
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./Login.Style";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import SocialButton from "../../../components/SocialButton";
import {LoginFunction} from "./login.function";

const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    email, setEmail, password, setPassword,
    isLoading, validateForm, handleLogin
  } = LoginFunction(navigation);

  // Ảnh nền (Thay bằng require nếu là ảnh local)
  const BG_SOURCE = { uri: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070" };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- LỚP 1: ẢNH NỀN TĨNH (Không bị bàn phím đẩy) --- */}
      <Image
        source={BG_SOURCE}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* --- LỚP 2: NỘI DUNG (Chịu ảnh hưởng bàn phím) --- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500} // Bỏ comment nếu trên Android bị đẩy quá cao
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20 } // Thêm padding top để tránh tai thỏ
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.glassCard}>
            <Text style={styles.title}>Explore World</Text>
            <Text style={styles.subtitle}>Sign in to start your adventure</Text>

            <CustomInput
              icon="mail-outline" // Đảm bảo bạn có icon này hoặc xóa prop icon đi
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <CustomInput
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="SIGN IN"
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={!validateForm}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Ví dụ Social Button */}
            <View style={{ gap: 10 }}>
               <CustomButton title="Continue with Google" onPress={()=>{}} variant="outline" />
            </View>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signUp}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
