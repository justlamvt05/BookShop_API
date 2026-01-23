// services/userService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

// Interceptor to automatically add Bearer token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Lấy thông tin profile của user đang đăng nhập
 * @returns {Promise} ApiResponse<UserProfile>
 */
export const getMyProfile = () => {
  return axios.get(`${API_URL}/profile`);
};

/**
 * Cập nhật profile của user đang đăng nhập
 * @param {Object} data - UpdateProfileRequest (firstname, lastname, email, phone, address, etc.)
 * @returns {Promise} ApiResponse<UserProfile>
 */
export const updateMyProfile = (data) => {
  return axios.put(`${API_URL}/profile`, data, {
    headers: { "Content-Type": "application/json" }
  });
};

/**
 * Lấy danh sách đơn hàng của user đang đăng nhập
 * @returns {Promise} ApiResponse<List<Order>>
 */
export const getMyOrders = () => {
  return axios.get(`${API_URL}/my-orders`);
};
