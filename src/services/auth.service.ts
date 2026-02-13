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
  async Register(fullName: string, email: string, confirmPassword: string) {
    const rq: RegisterRequest = { fullName, email, confirmPassword };
    const res = await apiRequest.Register(rq);
    if (res.status != 200)
      throw new Error(res.data.message || "Register failed");
    return res;
  },
};
