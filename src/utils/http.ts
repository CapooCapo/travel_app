import axios from "axios";
import { authStorage } from "../storage/auth.storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.72:8080";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Đính token JWT vào mọi request có sẵn
http.interceptors.request.use(async (config) => {
  const token = await authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Bắt lỗi HTTP chung, lấy message từ BE ApiResponse
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Network error";
    return Promise.reject(new Error(message));
  }
);

export default http;
