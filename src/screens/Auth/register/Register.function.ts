import { useState } from "react";
import { Alert } from "react-native";
import {
  isEmail, isRequired, validateConfirmPassword, validatePassword,
} from "../../../services/validator";
import { useAuthService } from "../../../services/auth.service";

export function RegisterFunction(navigation: any) {
  const authService = useAuthService();
  const [fullName,         setFullName]         = useState("");
  const [email,            setEmail]            = useState("");
  const [password,         setPassword]         = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [isLoading,        setIsLoading]        = useState(false);
  const [errors, setErrors] = useState({
    fullName: "", email: "", password: "", confirm: "",
  });

  const validateForm = (): boolean => {
    const fullNameError   = isRequired(fullName);
    const emailError      = isEmail(email);
    const passwordError   = validatePassword(password);
    const confirmError    = validateConfirmPassword(password, confirmPassword);

    setErrors({
      fullName: fullNameError ?? "",
      email:    emailError    ?? "",
      password: passwordError ?? "",
      confirm:  confirmError  ?? "",
    });

    return !fullNameError && !emailError && !passwordError && !confirmError;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Sử dụng Clerk SignUp
      await authService.signUpWithEmail(
        email.trim(),
        password.trim(),
      );
      Alert.alert("Success 🎉", "Account created! Please sign in.", [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    } catch (err: any) {
      Alert.alert("Register Failed", err?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    handleRegister,
    isLoading,
    errors,
  };
}
