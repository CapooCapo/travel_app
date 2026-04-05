import axios from "axios";

// ─── Tích hợp Clerk Token ──────────────────────────────────────────────────
type GetTokenOptions = { template?: string; skipCache?: boolean };
let clerkTokenGetter: ((options?: GetTokenOptions) => Promise<string | null>) | null = null;

/**
 * Hàm này dùng để liên kết Clerk getToken với Axios.
 * Thường được gọi từ AuthContext.tsx sau khi Clerk isLoaded.
 */
export const setClerkTokenGetter = (fn: (options?: GetTokenOptions) => Promise<string | null>) => {
  clerkTokenGetter = fn;
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.72:8080";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject Clerk Token
http.interceptors.request.use(
  async (config) => {
    if (clerkTokenGetter) {
      const token = await clerkTokenGetter({ template: 'jwt-template-account' });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // If token is null, the user is likely signed out or the session has expired.
        // We throw an error to prevent the request and potentially trigger a redirect/refresh.
        console.error("[HTTP] Clerk token is null. Request aborted.");
        return Promise.reject(new Error("TOKEN_NULL"));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("[HTTP] 401 Unauthorized detected. User may need to sign in again.");
      // Với Clerk, ta có thể để hook useAuth tự xử lý hoặc điều hướng qua AppNavigator
    }
    return Promise.reject(error);
  }
);

export default http;
