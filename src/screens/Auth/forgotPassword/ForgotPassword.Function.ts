import { useState } from "react";
import { Alert } from "react-native";
import { isEmail } from "../../../services/validator";
import { useAuthService } from "../../../services/auth.service";

export function ForgotPasswordFunction(navigation: any) {
  const authService = useAuthService();
  const BG_IMAGE = require("../../../../assets/images/lgoinbackground.jpg");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = !isEmail(email);

  const validateForm = () => {
    const emailErr = isEmail(email);

    setEmailError(emailErr || "");

    return {
      emailError: emailErr,
      isValid: !emailErr,
    };
  };

  const handleResetPassword = async () => {
    const form = validateForm();

    if (!form.isValid || isLoading) return;

    setIsLoading(true);

    try {
      await authService.forgotPassword(email.trim());

      Alert.alert("Check your email", "An OTP has been sent!", [
        { text: "OK", onPress: () => navigation.navigate("OtpVerification", { email: email.trim() }) },
      ]);
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Unable to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    BG_IMAGE,
    email,
    setEmail,
    emailError,
    setEmailError,
    isLoading,
    canSubmit,
    handleResetPassword,
  };
}
