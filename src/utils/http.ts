import axios from "axios";
import { Alert } from "react-native";

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

const logDebugRequest = (config: any) => {
  const isSearchOrAi = config.url?.includes('/api/users/search') || config.url?.includes('/api/locations/ai-recommend');
  if (isSearchOrAi) {
    console.log('[FE DEBUG] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      payload: config.data
    });
  }
};

const logDebugResponse = (response: any) => {
  const isSearchOrAi = response.config.url?.includes('/api/users/search') || response.config.url?.includes('/api/locations/ai-recommend');
  if (isSearchOrAi) {
    console.log('[FE DEBUG] Response:', {
      status: response.status,
      data: response.data
    });
  }
};

const logDebugError = (error: any) => {
  const isSearchOrAi = error.config?.url?.includes('/api/users/search') || error.config?.url?.includes('/api/locations/ai-recommend');
  const is500 = error.response?.status === 500;
  
  if (isSearchOrAi || is500) {
    console.error(`[FE DEBUG] ${is500 ? 'BACKEND 500 ERROR' : 'Error'}:`, {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status || 'No Status',
      data: error.response?.data || 'No Data',
      message: error.message
    });
  }
};

/**
 * Hiển thị thông báo lỗi quy chuẩn cho người dùng
 */
const showErrorAlert = (error: any) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const backendMessage = data?.message;

  let title = "Error";
  let message = backendMessage || "Unable to connect to the server. Please try again later.";

  switch (status) {
    case 400:
      title = "Bad Request";
      break;
    case 403:
      title = "Forbidden";
      break;
    case 500:
      title = "Server Error";
      message = backendMessage || "An internal server error occurred.";
      break;
    case 401:
      // 401 thường được xử lý riêng (ví dụ redirect về login)
      return; 
    default:
      if (!error.response) {
        message = "Unable to connect to the server. Please try again later.";
      }
  }

  Alert.alert(title, message, [{ text: "OK" }]);
};

// Request Interceptor: Inject Clerk Token & Log Payload
http.interceptors.request.use(
  async (config) => {
    if (clerkTokenGetter) {
      const token = await clerkTokenGetter({ template: 'jwt-template-account' });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error("[HTTP] Clerk token is null. Request aborted.");
        return Promise.reject(new Error("TOKEN_NULL"));
      }
    }

    logDebugRequest(config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors & Log Result
http.interceptors.response.use(
  (response) => {
    logDebugResponse(response);
    return response;
  },
  async (error) => {
    logDebugError(error);
    
    // Hiển thị Alert cho các lỗi quy chuẩn
    showErrorAlert(error);

    if (error.response && error.response.status === 401) {
      console.warn("[HTTP] 401 Unauthorized detected. User may need to sign in again.");
    }
    return Promise.reject(error);
  }
);

export default http;
