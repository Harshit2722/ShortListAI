import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        try {
            const originalRequest = error.config;

            const isAuthRequest =
                originalRequest.url.includes("/auth/login") ||
                originalRequest.url.includes("/auth/register") ||
                originalRequest.url.includes("/auth/refresh");

            if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
                originalRequest._retry = true
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {
                    withCredentials: true,
                })
                return api(originalRequest);
            }
        }
        catch (err) {
            window.location.replace("/login");
        }

        return Promise.reject(error);

    }
);

export default api;