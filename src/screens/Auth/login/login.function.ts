import { useState, useMemo } from "react";
import { Alert } from "react-native";
import { isEmail, validatePassword } from "../../../services/validator";
import { useAuthService } from "../../../services/auth.service";

export function LoginFunction(navigation: any) {
  const authService = useAuthService();

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BG_SOURCE = require("../../../../assets/images/lgoinbackground.jpg");

  const canSubmit = useMemo(() => 
    isEmail(email) === null && validatePassword(password) === null
  , [email, password]);

  const validateForm = () => {
    const emailError    = isEmail(email);
    const passwordError = validatePassword(password);
    return { emailError, passwordError, isValid: !emailError && !passwordError };
  };

  /**
   * Handle Email/Password Login via Clerk
   */
  const handleLogin = async () => {
    const { isValid } = validateForm();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      await authService.signInWithEmail(email, password);
      console.log("[Login] Email login successful via Clerk.");
      // Navigation will be handled automatically by AuthContext/AppNavigator state change
    } catch (e: any) {
      console.error("[Login] Email login error:", e);
      Alert.alert("Login Failed", e?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google OAuth Login via Clerk
   */
  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      console.log("[Login] Google login initiated via Clerk.");
    } catch (err: any) {
      console.error("[Login] Google login error:", err);
      // Only alert if it's not a user cancellation
      if (!err.message?.includes("cancel")) {
        Alert.alert("Login Failed", "Could not complete Google sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    isLoading,
    canSubmit,
    validateForm,
    handleLogin,
    handleGoogleLogin,
    BG_SOURCE,
  };
}
