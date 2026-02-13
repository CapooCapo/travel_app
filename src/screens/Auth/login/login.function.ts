import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { isEmail, validatePassword } from "../../../services/validator";
import { authService } from "../../../services/auth.service";

export function LoginFunction(navigation: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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
      // navigation.replace("Main");
    } catch (e: any) {
      Alert.alert("Login Failed", e?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    validateForm,
    handleLogin,
  };
}
