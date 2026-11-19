
import axios from "axios";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach authentication token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle API errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Authentication required or session expired.");
        }

        return Promise.reject(error);
    }
);

export default api;
