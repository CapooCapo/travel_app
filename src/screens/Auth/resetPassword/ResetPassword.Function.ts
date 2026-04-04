import { useState } from "react";
import { Alert } from "react-native";
import { useAuthService } from "../../../services/auth.service";
import { validatePassword } from "../../../services/validator";

export function ResetPasswordFunction(navigation: any, email: string, otp: string) {
  const authService = useAuthService();
  const BG_IMAGE = require("../../../../assets/images/lgoinbackground.jpg");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirm: "" });
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = password.length > 0 && confirmPassword.length > 0;

  const handleResetPassword = async () => {
    if (!canSubmit || isLoading) return;

    const passErr = validatePassword(password);
    const confirmErr = password !== confirmPassword ? "Passwords do not match." : null;

    if (passErr || confirmErr) {
      setErrors({ password: passErr || "", confirm: confirmErr || "" });
      return;
    }

    setIsLoading(true);
    setErrors({ password: "", confirm: "" });

    try {
      await authService.resetPassword(email, otp, password);
      
      Alert.alert("Success", "Your password has been successfully reset. Please log in.", [
        { 
          text: "Login now", 
          onPress: () => {
             // To prevent going back into the OTP/reset flow, reset the stack to Auth
             navigation.reset({
                index: 0,
                routes: [{ name: "SignIn" }],
             });
          }
        }
      ]);
    } catch (e: any) {
      Alert.alert("Reset Failed", e?.message || "An error occurred while resetting your password.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    BG_IMAGE,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    canSubmit,
    handleResetPassword,
  };
}
