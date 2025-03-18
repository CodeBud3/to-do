import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://to-do-test-cjnr.onrender.com", // Replace with your API URL
  withCredentials: true, // Ensures cookies (like HTTP-only JWT) are sent
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Sent:", config);
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
      localStorage.removeItem("token"); // Auto logout on 401
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
