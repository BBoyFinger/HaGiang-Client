import axios from 'axios';

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  // http://localhost:5000/api
  //https://hagiangtravel.onrender.com/api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
  // Có thể thêm các cấu hình khác như headers, timeout ở đây nếu cần
});

export default axiosInstance; 