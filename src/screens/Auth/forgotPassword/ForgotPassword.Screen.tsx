import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    View, Text, TouchableOpacity, Image, StatusBar,
    KeyboardAvoidingView, Platform, ScrollView, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ForgotPassword.Style";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import { ForgotPasswordFunction } from "./ForgotPassword.Function";

export default function ForgotPasswordScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const {
        BG_IMAGE,
        email,
        setEmail,
        emailError,
        setEmailError,
        isLoading,
        canSubmit,
        handleResetPassword
    } = ForgotPasswordFunction(navigation);
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
