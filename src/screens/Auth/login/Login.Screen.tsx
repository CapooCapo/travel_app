import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./Login.Style";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { useLogin } from "./useLogin";
import { GoogleLoginButton } from "@components/Auth/GoogleLoginButton";

const LoginScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const {
        email, setEmail, password, setPassword,
        isLoading, validateForm, handleLogin, handleGoogleLogin, canSubmit, BG_SOURCE
    } = useLogin(navigation);

    return (
        <ImageBackground
            source={BG_SOURCE}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <View style={styles.overlay} />

            <KeyboardAvoidingView
                style={styles.flexContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.glassCard}>
                        <Text style={styles.title}>Explore World</Text>
                        <Text style={styles.subtitle}>Sign in to start your adventure</Text>

                        <CustomInput
                            icon="mail-outline"
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
                            secureTextEntry={true}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <CustomButton
                            title="SIGN IN"
                            onPress={handleLogin}
                            isLoading={isLoading}
                            disabled={!canSubmit}
                        />

                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socialButtonWrapper}>
                            <GoogleLoginButton 
                                onPress={handleGoogleLogin} 
                                isLoading={isLoading} 
                            />
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
        </ImageBackground>
    );
};

export default LoginScreen;
