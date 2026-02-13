import axios from "axios";
import { authStorage } from "../storage/auth.storage";

const http = axios.create({
  baseURL: "http://192.168.1.11:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: interceptor
http.interceptors.request.use(async config => {
  const token = await authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default http;
