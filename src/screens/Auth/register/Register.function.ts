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

  const validateForm = () => {
    const fullNameError = isRequired(fullName);
    const emailError = isEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);

    setErrors({
      fullName: fullNameError || "",
      email: emailError || "",
      password: passwordError || "",
      confirm: confirmError || "",
    });

    return !(fullNameError || emailError || passwordError || confirmError);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    try {
      const res = await authService.Register(
        fullName.trim(),
        email.trim(),
        confirmPassword,
      );
      setIsLoading(false);
      Alert.alert("Successt", res.data.message);
      navigation.navigate("SignIn");
    } catch (err: any) {
      alert(err.message || "Register failed");
      setIsLoading(false);
    }
  };
  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
    isLoading,
    errors,
  };
}
