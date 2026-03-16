import http from "../utils/http";
import { Res } from "../dto/format";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../dto/auth/user.DTO";
import { forgotPassword } from "../screens/Auth/forgotPassword/ForgotPassword.Function";

export const apiRequest = {
  login(userAccount: LoginRequest) {
    return http.post<Res<LoginResponse>>("api/auth/login", userAccount);
  },
  register(newAccount: RegisterRequest) {
    return http.post<Res<RegisterRequest>>("/api/auth/register", newAccount);
  },
  googleLogin(idToken: string) {
    return http.post<Res<LoginResponse>>("/api/auth/google", { idToken });
  },
  forgotPassword(email: string) {
    return http.post<Res<{ message: string }>>("/api/auth/forgot-password", {
      email,
    });
  },
};
