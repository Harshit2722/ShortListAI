import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {

    failedQueue.forEach(({ resolve, reject }) => {

        if (error) {
            reject(error);
        } else {
            resolve();
        }

    });

    failedQueue = [];

};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        try {
            const originalRequest = error.config;

            if (!originalRequest) {
                return Promise.reject(error);
            }

            const isAuthRequest =
                originalRequest.url.includes("/auth/login") ||
                originalRequest.url.includes("/auth/register") ||
                originalRequest.url.includes("/auth/refresh");

            if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
                originalRequest._retry = true

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            resolve,
                            reject,
                        });
                    }).then(() => {
                        return api(originalRequest);
                    });
                }

                isRefreshing = true;

                await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {
                    withCredentials: true,
                })

                isRefreshing = false

                processQueue();

                return api(originalRequest);
            }
        }
        catch (err) {
            isRefreshing = false
            processQueue(err);
            window.location.replace("/login");
            return Promise.reject(err);
        }

        return Promise.reject(error);

    }
);

export default api;