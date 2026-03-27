import { useState } from "react";
import {
  isEmail,
  isRequired,
  validateConfirmPassword,
  validatePassword,
} from "../../../services/validator";
import { authService } from "../../../services/auth.service";
import { Alert } from "react-native";

export function RegisterFunction(navigation: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Returns true when the form is VALID (no errors)
  const validateForm = (): boolean => {
    const fullNameError    = isRequired(fullName);
    const emailError       = isEmail(email);
    const passwordError    = validatePassword(password);
    const confirmError     = validateConfirmPassword(password, confirmPassword);

    setErrors({
      fullName: fullNameError ?? "",
      email:    emailError    ?? "",
      password: passwordError ?? "",
      confirm:  confirmError  ?? "",
    });

    return !fullNameError && !emailError && !passwordError && !confirmError;
  };

  const handleRegister = async () => {
    const isValid = validateForm();
    if (!isValid) return;          // stop if any field has an error

    setIsLoading(true);
    try {
      const res = await authService.Register(
        fullName.trim(),
        email.trim(),
        password.trim(),
        confirmPassword.trim(),
      );
      Alert.alert("Success", res.data.message ?? "Account created!");
      navigation.navigate("SignIn");
    } catch (err: any) {
      Alert.alert("Register Failed", err?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,    setFullName,
    email,       setEmail,
    password,    setPassword,
    confirmPassword, setConfirmPassword,
    handleRegister,
    isLoading,
    errors,
  };
}
