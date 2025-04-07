import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const axiosInstance = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export default axiosInstance