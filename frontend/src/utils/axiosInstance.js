import axios from 'axios'

const API_BASE_URL = 'https://eztaskhub-personal-task-manager.onrender.com/api'

const axiosInstance = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export default axiosInstance