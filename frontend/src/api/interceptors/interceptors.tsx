import { API_BASE_URL } from "@/configs/appConfig";
import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Replace with your API URL
  withCredentials: true, // Ensures cookies (like HTTP-only JWT) are sent
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response Received:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    if (error.response?.status === 401) {
      // Redirect to login only if in protected path
      if (
        !["/login", "/signup"].includes(window.location.pathname.toLowerCase())
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
