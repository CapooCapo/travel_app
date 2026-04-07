import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    View, Text, TouchableOpacity, ImageBackground, StatusBar,
    KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ForgotPassword.Style";
import CustomInput from "@components/CustomInput";
import CustomButton from "@components/CustomButton";
import { useForgotPassword } from "./useForgotPassword";

export default function ForgotPasswordScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const {
        BG_IMAGE,
        email,
        setEmail,
        emailError,
        setEmailError,
        isLoading,
        handleResetPassword
    } = useForgotPassword(navigation);

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
                                <Ionicons name="lock-open-outline" size={40} color="#fff" />
                            </View>
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
        </ImageBackground>
    );
}
