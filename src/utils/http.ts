import axios from "axios";
import { Alert } from "react-native";

// ─── Tích hợp Clerk Token ──────────────────────────────────────────────────
type GetTokenOptions = { template?: string; skipCache?: boolean };
let clerkTokenGetter: ((options?: GetTokenOptions) => Promise<string | null>) | null = null;
let onUnauthorizedCallback: (() => Promise<void>) | null = null;

/**
 * Hàm này dùng để liên kết Clerk getToken với Axios.
 * Thường được gọi từ AuthContext.tsx sau khi Clerk isLoaded.
 */
export const setClerkTokenGetter = (fn: (options?: GetTokenOptions) => Promise<string | null>) => {
  clerkTokenGetter = fn;
};

/**
 * Hàm này dùng để liên kết callback khi token hết hạn hoặc lỗi 401.
 */
export const setOnUnauthorized = (fn: () => Promise<void>) => {
  onUnauthorizedCallback = fn;
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
  console.log(`[HTTP REQUEST] → ${config.method?.toUpperCase()} ${config.url}`, {
    auth: !!config.headers.Authorization,
    headers: { ...config.headers, Authorization: config.headers.Authorization ? 'Bearer [PRESENT]' : 'NONE' },
    data: config.data
  });
};

const logDebugResponse = (response: any) => {
  console.log(`[HTTP RESPONSE] ← ${response.status} ${response.config.url}`, {
    data: response.data
  });
};

const logDebugError = (error: any) => {
  console.error('[HTTP ERROR] ✖', {
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    status: error.response?.status,
    message: error.message,
    responseData: error.response?.data,
  });
};

/**
 * Hiển thị thông báo lỗi quy chuẩn cho người dùng
 */
const showErrorAlert = (error: any) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const backendMessage = data?.message;

  let title = "Error";
  let displayMessage = backendMessage || error.message || "An unexpected error occurred.";

  if (status === 401) {
    title = "Session Expired";
    displayMessage = "Please login again to continue.";
  } else if (status === 403) {
    title = "Access Denied";
    displayMessage = "You do not have permission to perform this action.";
  } else if (status >= 500) {
    title = "Server Error";
    displayMessage = "Server encountered an error. Please try again later.";
  }

  Alert.alert(title, displayMessage, [{ text: "OK" }]);
};

// Request Interceptor: Inject Clerk Token & Log Payload
http.interceptors.request.use(
  async (config) => {
    // Tự động đính kèm token nếu có getter (chỉ cho app API)
    const isExternal = config.url?.startsWith('http') && !config.url?.startsWith(BASE_URL);
    
    if (!isExternal && clerkTokenGetter) {
      try {
        const token = await clerkTokenGetter({ template: 'jwt-template-account' });
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("[HTTP AUTH] No token found for protected endpoint:", config.url);
        }
      } catch (err) {
        console.error("[HTTP AUTH] Failed to retrieve Clerk token:", err);
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
    
    const status = error.response && error.response.status;

    if (status === 401) {
      console.warn("[HTTP AUTH] 401 Unauthorized! Triggering logout callback...");
      
      // Hiển thị Alert trước khi dọn dẹp state
      showErrorAlert(error);

      if (onUnauthorizedCallback) {
        await onUnauthorizedCallback();
      }
      return Promise.reject(error);
    }
    
    // Hiển thị Alert cho các lỗi khác (403, 500, etc.)
    showErrorAlert(error);

    return Promise.reject(error);
  }
);

export default http;
