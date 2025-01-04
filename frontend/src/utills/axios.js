import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiBase,
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true; // Prevent infinite loops

      try {
        const { data } = await axiosInstance.get('/auth/refresh');
        localStorage.setItem('token', data.accessToken);
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axiosInstance(error.config); // Retry the failed request
      } catch (refreshError) {
        localStorage.clear();
      
      
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
