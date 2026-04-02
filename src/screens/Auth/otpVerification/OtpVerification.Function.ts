import { useState } from "react";
import { Alert } from "react-native";
import { authService } from "../../../services/auth.service";

export function OtpVerificationFunction(navigation: any, email: string) {
  const BG_IMAGE = require("../../../../assets/images/lgoinbackground.jpg");
  
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = otp.length === 6;

  const handleVerifyOtp = async () => {
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setOtpError("");

    try {
      await authService.verifyOtp(email, otp);
      
      // Navigate to Reset Password if successful
      navigation.navigate("ResetPassword", { email, otp });
    } catch (e: any) {
      const msg = e?.message || "Invalid or expired OTP";
      setOtpError(msg);
      Alert.alert("Verification Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.forgotPassword(email);
      Alert.alert("Sent", "A new OTP has been sent to your email.");
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Could not resend OTP.");
    }
  };

  return {
    BG_IMAGE,
    otp,
    setOtp,
    otpError,
    isLoading,
    canSubmit,
    handleVerifyOtp,
    handleResend,
  };
}
