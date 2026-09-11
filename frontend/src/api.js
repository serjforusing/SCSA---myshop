import axios from "axios";

const baseURL = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/$/, "");
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
    const access = localStorage.getItem("access");
    if (access) {
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;
        const refresh = localStorage.getItem("refresh");

        if (error.response?.status === 401 && refresh && !request?._retry && !request.url.includes("/api/login/")) {
            request._retry = true;
            try {
                const response = await axios.post(`${baseURL}/api/login/refresh/`, { refresh });
                localStorage.setItem("access", response.data.access);
                request.headers.Authorization = `Bearer ${response.data.access}`;
                return api(request);
            } catch (refreshError) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
