// services/userService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getMyProfile = () => {
  return axios.get(`${API_URL}/profile`);
};


export const updateMyProfile = (data) => {
  return axios.put(`${API_URL}/profile`, data, {
    headers: { "Content-Type": "application/json" }
  });
};


export const getMyOrders = () => {
  return axios.get(`${API_URL}/my-orders`);
};
