import { LoginRequest, RegisterRequest, UpdateUserRequest } from "../dto/auth/user.DTO";
import { apiRequest } from "../api/client";
import { authStorage } from "../storage/auth.storage";

export const authService = {

  async login(email: string, password: string): Promise<string> {
    const req: LoginRequest = { email, password };
    const res = await apiRequest.login(req);
    // BE ApiResponse: { status, message, data: { token } }
    const token = res.data?.data?.token;
    if (!token) throw new Error(res.data?.message || "Login failed");
    await authStorage.setToken(token);
    return token;
  },

  async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<string> {
    const req: RegisterRequest = { fullName, email, password, confirmPassword };
    const res = await apiRequest.register(req);
    return res.data?.message ?? "Registered successfully. Check email to verify.";
  },

  async googleLogin(idToken: string): Promise<string> {
    if (!idToken) throw new Error("Google token missing");
    const res = await apiRequest.googleLogin(idToken);
    const token = res.data?.data?.token;
    if (!token) throw new Error("Invalid server response");
    await authStorage.setToken(token);
    return token;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiRequest.forgotPassword(email);
  },

  async signOut(): Promise<void> {
    await authStorage.clear();
  },
};
