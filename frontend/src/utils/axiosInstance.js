import axios from 'axios'

const API_BASE_URL = 'https://eztaskhub-personal-task-manager.onrender.com/api'

const axiosInstance = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;