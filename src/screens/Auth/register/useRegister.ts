import { useState } from "react";
import { Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import {
  isEmail, isRequired, validateConfirmPassword, validatePassword,
} from "../../../services/validator";

export function useRegister(navigation: any) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [fullName,         setFullName]         = useState("");
  const [email,            setEmail]            = useState("");
  const [password,         setPassword]         = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [code,             setCode]             = useState("");
  
  const [isLoading,           setIsLoading]           = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "", email: "", password: "", confirm: "", code: "",
  });

  /**
   * Maps Clerk error codes to user-friendly messages
   */
  const mapClerkError = (err: any) => {
    const code = err.errors?.[0]?.code;
    const message = err.errors?.[0]?.message;

    switch (code) {
      case "form_password_pwned":
        return "This password is too common. Please choose a stronger one.";
      case "form_identifier_exists":
        return "This email address is already registered.";
      case "form_password_length_too_short":
        return "Password must be at least 8 characters long.";
      default:
        return message || "An unexpected error occurred. Please try again.";
    }
  };

  const validateForm = (): boolean => {
    const fullNameError   = isRequired(fullName);
    const emailError      = isEmail(email);
    const passwordError   = validatePassword(password);
    const confirmError    = validateConfirmPassword(password, confirmPassword);

    setErrors(prev => ({
      ...prev,
      fullName: fullNameError ?? "",
      email:    emailError    ?? "",
      password: passwordError ?? "",
      confirm:  confirmError  ?? "",
    }));

    return !fullNameError && !emailError && !passwordError && !confirmError;
  };

  /**
   * Phase 1: Create account & trigger verification email
   */
  const handleRegister = async () => {
    if (!isLoaded || !validateForm()) return;

    setIsLoading(true);
    try {
      // 1. Create the user in Clerk
      await signUp.create({
        emailAddress: email.trim(),
        password: password.trim(),
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
      });

      // 2. Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // 3. Switch to OTP UI
      setPendingVerification(true);
    } catch (err: any) {
      const friendlyMsg = mapClerkError(err);
      Alert.alert("Registration Error", friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Phase 2: Verify OTP & Activate session
   */
  const handleVerify = async () => {
    if (!isLoaded || !code) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        // This will trigger the AuthContext sync logic automatically
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Alert.alert("Verification Incomplete", "Please check your code and try again.");
      }
    } catch (err: any) {
      Alert.alert("Verification Error", mapClerkError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    code, setCode,
    handleRegister,
    handleVerify,
    isLoading,
    pendingVerification,
    errors,
  };
}
