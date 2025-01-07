import axios from "axios";
import { API_CONFIG } from "../config/api";

const apiClient = axios.create({
  baseURL: `${API_CONFIG.baseURL}/${API_CONFIG.version}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add any global request/response interceptors here
apiClient.interceptors.request.use((config) => {
  // Add auth token if needed
  // const token = getToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific API error responses
    const errorMessage = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
