import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export default api;
