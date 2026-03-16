import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { isEmail, validatePassword } from "../../../services/validator";
import { authService } from "../../../services/auth.service";
import { useOAuth, useAuth } from "@clerk/clerk-expo";

export function LoginFunction(navigation: any) {
  const [loading, setLoading] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canSumbit = !isEmail(email) && !validatePassword(password);
  const BG_SOURCE = {
    uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
  };
  const { isSignedIn } = useAuth();

  const validateForm = () => {
    const emailError = isEmail(email);
    const passwordError = validatePassword(password);

    return {
      emailError,
      passwordError,
      isValid: !emailError && !passwordError,
    };
  };

  const handleLogin = async () => {
    const form = validateForm();

    if (!form.isValid || isLoading) return;

    setIsLoading(true);
    try {
      await authService.Login(email.trim(), password);
      console.log("success");
    } catch (e: any) {
      Alert.alert("Login Failed", e?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        additionalParameters: {
          prompt: "select_account",
        },
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        navigation.navigate("Home");
      }
    } catch (err: any) {
      Alert.alert(
        "Login failed",
        err?.errors?.[0]?.message || "Google login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    canSumbit,
    validateForm,
    handleLogin,
    handleGoogleLogin,
    BG_SOURCE,
  };
}
