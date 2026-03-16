import { LoginRequest, RegisterRequest } from "../dto/auth/user.DTO";
import { apiRequest } from "../api/client";
import { authStorage } from "../storage/auth.storage";

export const authService = {
  async Login(email: string, password: string) {
    const rq: LoginRequest = { email, password };
    const res = await apiRequest.login(rq);
    if (res.status != 200) {
      throw new Error(res.data.message || "Login failed");
    }
    const { token, user } = res.data.data;
    await authStorage.setToken(token);

    return token;
  },
  async Register(
    fullName: string,
    email: string,
    password,
    confirmPassword: string,
  ) {
    const rq: RegisterRequest = { fullName, email, password, confirmPassword };
    const res = await apiRequest.register(rq);
    if (res.status != 200)
      throw new Error(res.data.message || "Register failed");
    return res;
  },

  async googleLogin(idToken: string) {
    if (!idToken) {
      throw new Error("Google token missing");
    }

    try {
      const res = await apiRequest.googleLogin(idToken);

      const token = res?.data?.data?.token;

      if (!token) {
        throw new Error("Invalid server response");
      }

      return token;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Network error";

      throw new Error(message);
    }
  },
  async forgotPassword(email: string) {
    const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Forgot password failed");
    }

    return response.json();
  },
};
