import axios from "axios";
import { clearLocalStorage } from "./storage";
export function getLocalAuthToken() {
    const authToken = window.localStorage.getItem("x-auth-token");
    return authToken;
}

export function getUserId() {
    const userId = window.localStorage.getItem("user_id");
    return userId;
}

export function getUserRole() {
    const userRole = window.localStorage.getItem("user_role");
    return userRole;
}

const axiosInstance = axios.create({
    baseURL: "https://hiring-backend-bsx1.onrender.com/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    function (config) {
        const token = getLocalAuthToken();
        if (token) {
            config.headers["x-auth-token"] = token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Create a function to handle navigation
function navigateToLogin() {
    window.location.href = "/login";
}

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error, redirect to login

            navigateToLogin();
            clearLocalStorage();  
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
