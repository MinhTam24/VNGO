import axios from 'axios';
import queryString from 'query-string';
import { useAuth } from '../js/contexts/AuthContext';
import config from '../config.json';

const axiosClient = axios.create({
  baseURL: `${config.SERVER_API}`,  
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use((response) => {
    if(response && response.data){
        return response.data
    }
    return response;
}, (error) => {
     const { response } = error;

    // Kiểm tra nếu lỗi là 401 (Unauthorized), tức là token hết hạn
    if (response && response.status === 401) {
      localStorage.removeItem("token");
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
});

export default axiosClient;
