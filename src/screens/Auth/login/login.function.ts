import { useState } from "react";
import { Alert } from "react-native";
import { isEmail, validatePassword } from "../../../services/validator";
import { authService } from "../../../services/auth.service";
import { useOAuth } from "@clerk/clerk-expo";
import { useAppAuth } from "../../../context/AuthContext";

export function LoginFunction(navigation: any) {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { setHasCustomToken } = useAppAuth();

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const BG_SOURCE = {
    uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
  };

  const canSubmit = isEmail(email) === null && validatePassword(password) === null;

  const validateForm = () => {
    const emailError    = isEmail(email);
    const passwordError = validatePassword(password);
    return { emailError, passwordError, isValid: !emailError && !passwordError };
  };

  // ── Email / Password login ──────────────────────────────────────────────
  const handleLogin = async () => {
    const { isValid } = validateForm();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      // authService.login (lowercase) — trả token, tự lưu vào storage
      await authService.login(email.trim(), password);
      setHasCustomToken(true);
      // Navigation điều hướng tự động qua useAuth().isSignedIn trong AppNavigator
    } catch (e: any) {
      Alert.alert("Login Failed", e?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google OAuth (Clerk) ────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    if (oauthLoading) return;
    setOauthLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        // AppNavigator sẽ tự redirect vì isSignedIn thay đổi
      }
    } catch (err: any) {
      Alert.alert("Login Failed", err?.errors?.[0]?.message || "Google login failed");
    } finally {
      setOauthLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    isLoading: isLoading || oauthLoading,
    canSubmit,
    validateForm,
    handleLogin,
    handleGoogleLogin,
    BG_SOURCE,
  };
}
