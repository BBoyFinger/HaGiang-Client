import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  // Có thể thêm các cấu hình khác như headers, timeout ở đây nếu cần
});

export default axiosInstance; 